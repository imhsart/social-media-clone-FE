import { useState } from "react"
import { X } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { updateProfile } from "../redux/slices/UserSlice"
const backendUrl = import.meta.env.VITE_BACKEND_URL

const EditProfile = ({isOpen, onClose, userData}) => {
  const [savingProfile, setSavingProfile] = useState(false)
  const dispatch = useDispatch()
  const [formInput, setFormInput] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    bio: userData?.bio || "",
    isProfilePublic: userData?.isProfilePublic ?? true
  })

  if(!isOpen){
    return null
  }
  function handleChange(e){
    const { name, value, type, checked } = e.target
    setFormInput(prev => ({...prev, [name]: type === "checkbox" ? checked : value}))
  }
  async function handleFormSubmit(e){
    e.preventDefault()
    if(formInput.firstName.trim() === "" || formInput.lastName.trim() === "" || formInput.bio.trim() === ""){
        toast.error("Please fill in all the fields.")
        return
      }
    try{
      setSavingProfile(true)
      const response = await axios.patch(`${backendUrl}/profile/edit`, formInput, {withCredentials: true})
      const resData = response.data
      if(resData.success){
        toast.success(resData.message)
        dispatch(updateProfile(resData.data))
        onClose()
      }
    }
    catch(error){
      console.log(error)
      toast.error(error.response.data.message || "Profile update failed. Please try again.")
    }
    finally{
      setSavingProfile(false)
    }
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-surface border border-line p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-text-primary">Edit profile</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="firstName" className="text-xs text-text-secondary">First name</label>
              <input
                name="firstName"
                id="firstName"
                value={formInput.firstName}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="text-xs text-text-secondary">Last name</label>
              <input
                name="lastName"
                id="lastName"
                value={formInput.lastName}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="text-xs text-text-secondary">Username</label>
            <input
              value={userData?.username || ""}
              disabled
              id="username"
              className="mt-1 w-full rounded-lg border border-line bg-bg/50 px-3 py-2 text-sm text-text-secondary cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="bio" className="text-xs text-text-secondary">Bio</label>
            <textarea
              name="bio"
              id="bio"
              value={formInput.bio}
              onChange={handleChange}
              rows={3}
              maxLength={160}
              className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-text-primary resize-none focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <span className="text-[11px] text-text-secondary">{formInput.bio.length}/160</span>
          </div>

          <label htmlFor="isProfilePublic" className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5">
            <span className="text-sm text-text-primary">Public profile</span>
            <input
              type="checkbox"
              name="isProfilePublic"
              id="isProfilePublic"
              checked={formInput.isProfilePublic}
              onChange={handleChange}
              className="h-4 w-4 accent-accent"
            />
          </label>

          <button
            type="submit"
            disabled={savingProfile}
            className="mt-2 rounded-full bg-accent py-2.5 text-sm font-medium text-cream hover:bg-accent-soft transition-colors disabled:opacity-60"
          >
            {savingProfile ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile