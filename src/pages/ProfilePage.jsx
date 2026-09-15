import { useSelector, useDispatch } from "react-redux"
import { Pencil, Lock } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { updateDp } from "../redux/slices/UserSlice"
import defaultDp from "../assets/default_profile_picture.png"
import { useState } from "react"
import EditProfile from "../components/EditProfile"
const backendUrl = import.meta.env.VITE_BACKEND_URL

const ProfilePage = () => {
  const { data: userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [showEditModal, setShowEditModal] = useState(false)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [imgPreview, setImgPreview] = useState(null)

  const stats = [
    { label: "Posts", value: 0 },
    { label: "Followers", value: 0 },
    { label: "Following", value: 0 },
  ]

  function formatJoinDate(dateString){
    if(!dateString) return "recently"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    })
  }

  async function handleImageUpdate(e){
    const file = e.target.files[0]
    if(!file){
      toast.error("No file was selected.")
      return
    }
    if(!file.type.startsWith("image/")){
      toast.error("File must be an image")
      return
    }
    const maxSize = 3 * 1024 * 1024
    if(file.size > maxSize){
      toast.error("File size must be 3MB or less.")
      return
    }
    if(imgPreview){
      URL.revokeObjectURL(imgPreview)
    }
    setImgPreview(URL.createObjectURL(file))
    const imageData = new FormData()
    imageData.append("file", file)
    e.target.value=""
    setIsImageUploading(true)
    try{
      const response = await axios.patch(`${backendUrl}/profile/edit/profile-picture`, imageData, {withCredentials: true})
      if(response.data.success){
        toast.success(response.data.message)
        dispatch(updateDp(response.data.data))
        URL.revokeObjectURL(imgPreview)
        setImgPreview(null)
      }
    }
    catch(error){
      console.log(error)
      toast.error(error.response.data.message || "Failed to update the profile picture. Please try again.")
    }
    finally{
      setIsImageUploading(false)
    }
  }


  return (
    <div className="mx-auto max-w-3xl min-h-screen">
      {/* Banner */}
      <div className="relative h-28 md:h-40 rounded-b-2xl bg-gradient-to-br from-accent-soft via-surface to-bg overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,var(--color-accent),transparent_60%)]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_80%,var(--color-accent-soft),transparent_50%)]" />
      </div>

      <div className="px-4 md:px-8 -mt-12 md:-mt-14 flex items-end justify-between">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/40 blur-md" />
          <img
            src={imgPreview || userData?.displayPicture || defaultDp}
            alt="profile-picture"
            className="relative h-24 w-24 md:h-32 md:w-32 object-cover rounded-full ring-4 ring-bg shrink-0"
          />
        <label
          htmlFor="update-image"
          aria-disabled={isImageUploading}
          className={`absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-cream cursor-pointer transition-colors ring-2 ring-bg ${
            isImageUploading ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer hover:bg-accent-soft"
          }`}
        >
          <Pencil size={14} strokeWidth={2} />
        </label>
        <input 
          type="file"
          id="update-image"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpdate}
          disabled={isImageUploading}
        />
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="mt-4 md:mt-0 mb-1 md:mb-4 rounded-full border border-accent px-5 py-2 text-sm font-medium text-accent hover:bg-accent-soft hover:text-cream transition-colors"
        >
          Edit profile
        </button>
      </div>

      <div className="px-4 md:px-8 mt-3">
        <h1 className="text-lg md:text-xl font-semibold text-text-primary">
          {userData?.firstName + " " + userData?.lastName || "Your Name"}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            @{userData?.username || "username"}
          </p>
          {!userData?.isProfilePublic && (
            <span className="flex items-center gap-1 text-[11px] text-text-secondary border border-line rounded-full px-2 py-0.5">
              <Lock size={10} />
              Private
            </span>
          )}
        </div>
        <p className="text-xs text-cream mt-1">
          Joined {formatJoinDate(userData?.createdAt)}
        </p>
      </div>

      {/* Stat bubbles */}
      <div className="px-4 md:px-8 mt-5 flex gap-3 md:gap-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex-1 md:flex-none md:min-w-32 rounded-2xl bg-surface border border-line px-4 py-3 md:py-4 flex flex-col items-center gap-1 hover:border-accent-soft hover:-translate-y-0.5 transition-all transition-colors"
          >
            <span className="text-xl md:text-2xl font-semibold text-accent">
              {value}
            </span>
            <span className="text-xs md:text-sm text-text-secondary">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Bio */}
      <div className="px-4 md:px-8 mt-6">
        <div className="rounded-2xl bg-surface border border-line px-4 py-4 md:px-6 md:py-5">
          <h2 className="text-xs uppercase tracking-wide text-text-secondary mb-1.5">
            Bio
          </h2>
          <p className="text-sm md:text-base text-text-primary/90">
            {userData?.bio || "Add a short bio to tell people about yourself."}
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-8 border-t border-line px-4 md:px-8">
        <div className="flex gap-6 -mb-px">
          <button className="relative py-3 text-sm font-medium text-accent">
            Posts
            <span className="absolute left-0 -bottom-px h-[2px] w-full bg-accent rounded-full" />
          </button>
          <button className="py-3 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Saved
          </button>
        </div>

        <div className="py-16 flex flex-col items-center justify-center my-2 text-text-secondary">
          <p className="text-sm">No posts yet</p>
        </div>
      </div>
      {showEditModal && (
        <EditProfile
          userData={userData}
          onClose={() => setShowEditModal(false)}
          isOpen={showEditModal}
        />
      )}
    </div>
  )
}

export default ProfilePage