import { useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { ArrowLeft } from "lucide-react"
import { fetchAllPosts } from "../redux/slices/PostsSlice"
import LoadingSpinner from "../components/LoadingSpinner"
import PostCard from "../components/PostCard"


const ViewPosts = () => {
  const { userId, postId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, page, hasMore, status } = useSelector(state => state.posts)
  const myId = useSelector(state => state.user.data?.userId)
  const targetRef = useRef(null)
  const hasScrolled = useRef(false)
  const sentinelRef = useRef(null)

  const isOwn = userId === myId
  const found = items.some(p => p._id === postId)
  const notFound = isOwn && status === "succeeded" && !hasMore && !found
  const canLoadMore = isOwn && hasMore && status === "succeeded"

  //inital fetch
  useEffect(() => {
    if(myId && isOwn){
      dispatch(fetchAllPosts())
    }
  }, [myId, isOwn, dispatch])

  useEffect(() => {
    hasScrolled.current = false
  }, [postId])

  //open feed scrolled to the selected post in posts feed
  useEffect(() => {
    if(!isOwn || hasScrolled.current || items.length === 0) return
    if(targetRef.current){
      targetRef.current.scrollIntoView({ block: "start" })
      hasScrolled.current = true
    }else if(hasMore && status === "succeeded"){
      dispatch(fetchAllPosts({ page: page + 1 }))
    }
  }, [isOwn, items.length, postId, hasMore, status, page, dispatch])

  //infinite scrolling
  useEffect(() => {
    const node = sentinelRef.current
    if(!node || !canLoadMore) return
    const observer = new IntersectionObserver(
        ([entry]) => {
          if(entry.isIntersecting){
            dispatch(fetchAllPosts({ page: page + 1 }))
          }
        }, { rootMargin: "300px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [canLoadMore, page, dispatch])

  const goBack = () => {
    if(window.history.state?.idx > 0) navigate(-1)
    else navigate("/profile")
  }

  return (
    <div className="mx-auto min-h-screen max-w-xl border-x border-line">
      <header className="sticky top-16 md:top-20 z-10 h-12 flex items-center gap-3 bg-bg/95 px-4 backdrop-blur border-b border-line">
        <button onClick={goBack} aria-label="Go back" className="cursor-pointer text-text-primary">
          <ArrowLeft size={20} />
        </button>
        <h3 className="font-semibold text-text-primary">Posts</h3>
      </header>
      {!isOwn ? (
        <p className="py-10 text-center text-sm text-text-secondary">
          Viewing other users' posts isn't supported yet.
        </p>
      ) : notFound ? (
        <p className="py-10 text-center text-sm text-text-secondary">Post not found.</p>
      ) : (
        <div className="flex flex-col gap-6 px-3 py-6 sm:px-4"> 
          {items.map(post => (
            <PostCard key={post._id} post={post} ref={post._id === postId ? targetRef : null} />
          ))}
          <div ref={sentinelRef} className="flex justify-center py-2">
            {status === "loading" && <LoadingSpinner size="sm" className="text-accent" />}
          </div>
        </div>
      )}   
    </div>
  )
}

export default ViewPosts