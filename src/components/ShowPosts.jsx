import { fetchAllPosts } from "../redux/slices/PostsSlice"
import { useEffect, useRef } from "react"
import toast from "react-hot-toast"
import { ImageOff } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import LoadingSpinner from "../components/LoadingSpinner"
import DefaultPost from "../assets/default_post_image.jpg"

const ShowPosts = () => {
  const dispatch = useDispatch()
  const { items, page, hasMore, error, status } = useSelector(state => state.posts)
  const myId = useSelector((state) => state.user.data?.userId)
  const sentinelRef = useRef(null)

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

  const canLoadMore = hasMore && status === "succeeded"

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

  if(items.length === 0 && (status === "idle" || status === "loading")){
    return (
      <div className="grid grid-cols-3 gap-1 md:gap-2 w-full">
        {
          Array.from({ length: 12}).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-surface border border-line animate-pulse" />
          ))
        }
      </div>
    )
  }

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
      <div className="grid grid-cols-4 gap-1 md:gap-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-surface border border-line"
          >
            <img
              src={item?.media?.url || DefaultPost}
              alt="post"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/30 transition-colors" />
          </div>
        ))}
      </div>

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

export default ShowPosts