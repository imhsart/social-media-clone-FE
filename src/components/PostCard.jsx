import defaultDp from "../assets/default_profile_picture.png"
import DefaultPost from "../assets/default_post.png"
import PostMenu from "./PostMenu"

const getPoster = (url) => url?.replace(/\.[^./]+$/, ".jpg")

const PostCard = ({ post, ref }) => {
  const { authorId: author, media } = post
  const isVideo = media?.resourceType === "video"

  return (
    <article
      ref={ref}
      className="scroll-mt-32 md:scroll-mt-36 overflow-hidden rounded-2xl bg-surface font-mono text-text-primary"
    >
      <header className="flex items-start gap-3 px-4 py-3">  
        <img 
          src={author.displayPicture || defaultDp}
          alt={`${author.username}'s profile picture`}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-text-primary">{author.username}</span>
        { post.isOwnPost && (
          <div className="ml-auto text-text-secondary">
            <PostMenu post={post} /> 
          </div>
        )}
      </header>

      <div className="aspect-square bg-bg">
      {isVideo ? (
        <video
          src={media.url}
          poster={getPoster(media.url)}
          controls
          playsInline
          preload="none"
          className="h-full w-full bg-black object-contain"
        />
      ) : (
        <img 
        src={post.media?.url || DefaultPost}
        alt="post"
        className="h-full w-full object-cover"
        />
      )}
      </div>
    </article>
  )
}

export default PostCard


//ROUGH INDIVIDUAL POST CARD IN POSTS FEED