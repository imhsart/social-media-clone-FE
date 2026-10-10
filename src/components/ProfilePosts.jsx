import { fetchAllPosts } from "../redux/slices/PostsSlice"
import { useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { ImageOff, Play } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import LoadingSpinner from "./LoadingSpinner"
import DefaultPost from "../assets/default_post.png"
import { Link } from "react-router-dom"

const ProfilePosts = () => {
  const dispatch = useDispatch()
  const { items, page, hasMore, error, status } = useSelector(state => state.posts)
  const myId = useSelector((state) => state.user.data?.userId)
  const sentinelRef = useRef(null)
  const getPoster = (url) => url?.replace(/\.[^./]+$/, ".jpg")
  const canLoadMore = hasMore && status === "succeeded"

  //inital fetch
  useEffect(() => {
    if(myId){
      dispatch(fetchAllPosts())
    }
  }, [myId, dispatch])

  useEffect(() => {
    if(error){
      toast.error(error, {id: "posts-error"})
    }
  }, [error])


  useEffect(() => {
    const node = sentinelRef.current
    if(!node || !canLoadMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting){
          dispatch(fetchAllPosts({ page: page+1 }))
        }
      }, 
      { rootMargin: "300px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [canLoadMore, page, dispatch])

  //post grid skeleton
  if(items.length === 0 && (status === "idle" || status === "loading")){
    return (
      <div className="grid grid-cols-3 gap-1 w-full">
        {
          Array.from({ length: 12}).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-lg bg-surface border border-line animate-pulse" />
          ))
        }
      </div>
    )
  }

  //failed fetch posts case
  if(items.length === 0 && status === "failed"){
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-text-secondary">
        <p className="text-sm">Couldn't load your posts.</p>
        <button
          onClick={() => dispatch(fetchAllPosts())}
          className="rounded-full border border-accent px-5 py-2 text-sm text-accent hover:bg-accent-soft hover:text-cream transition-colors cursor-pointer"
        >
          Try again
        </button>
      </div>
    )
  }

  //empty posts
  if(items.length === 0){
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-text-secondary">
        <ImageOff size={32} strokeWidth={1.5} />
        <p className="text-sm">No posts yet.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => (
          <Link
            key={item._id}
            to={`/user/${myId}/posts/${item._id}`}
            className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg bg-surface border border-line"
          >
            <img
              src={item?.media?.resourceType === "video" ? getPoster(item.media.url) : item?.media?.url || DefaultPost}
              alt="post"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {item?.media?.resourceType === "video" && <Play size={16} className="absolute right-2 top-2 text-cream" />}
            <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/30 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Intersection observer element */}
      <div ref={sentinelRef} className="flex justify-center py-6">
        {status === "loading" && <LoadingSpinner size="sm" /> }
        {status === "failed" && (
          <button
            onClick={() => dispatch(fetchAllPosts({ page: page + 1 }))}
            className="text-sm text-accent hover:underline cursor-pointer"
          >
            Couldn't load more. Tap to retry
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfilePosts