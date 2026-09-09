import { useState, useRef } from "react";
import defaultDp from "../assets/default_profile_picture.png"
import toast from "react-hot-toast";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL
import {fetchCurrentUser} from "../redux/slices/UserSlice"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data: userData } = useSelector(state => state.user)
  const formRef = useRef(null)

  function handleImageUpload(e){
    const file = e.target.files[0]
    if(!file){
      toast.error("No file was selected.")
      return
    }
    const maxSize = 3 * 1024 * 1024
    if(!file.type.startsWith("image/")){
      toast.error("File must be an image!")
      return
    }
    if(file.size > maxSize){
      toast.error("File size must be 3MB or less!")
      return
    }
    if(imagePreview){
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(URL.createObjectURL(file))
    const imageData = new FormData()
    imageData.append("file", file)
    setImageFile(imageData)
    e.target.value = ""
  }

  async function handleFormSubmit(e){
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(formRef.current)
    const payload = {
      firstName: formData.get("firstname"),
      lastName: formData.get("lastname"),
      DOB: formData.get("DOB"),
      gender: formData.get("gender"),
      bio: formData.get("bio"),
      isProfilePublic: formData.get("isPublic") === "on"
    }
    if(!payload.firstName.trim()){
      toast.error("First name is required.")
      return
    }
    if(!payload.lastName.trim()){
      toast.error("Last name is required.")
      return
    }
    if(!payload.DOB){
      toast.error("Date of birth is required.")
      return
    }
    if(!payload.gender){
      toast.error("Please select a gender.")
      return
    }
    setIsSubmitting(true)
    try{
      console.log(payload)
      const response = await axios.put(`${backendUrl}/profile/complete`, payload, {withCredentials: true})
      const resData = response.data

      //checking if image was selected
      if(imageFile){
        try{
          const imgResponse = await axios.patch(`${backendUrl}/profile/edit/profile-picture`, imageFile, {withCredentials: true})
          if(imgResponse.data.success){
            URL.revokeObjectURL(imagePreview)
            setImagePreview(null)
            setImageFile(null)
          }
        }
        catch(error){
          console.log(error)
          toast.error(error.response?.data?.message || "Profile saved, but image upload failed. You can add it later from settings.")
        }
      }

      if(resData.success){
        toast.success(resData.message)
        form.reset()
        await dispatch(fetchCurrentUser())
        navigate("/home")
      }
    }
    catch(error){
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to update profile data. Please try again.")
    }
    finally{
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex font-mono items-center justify-center px-4 py-10"
    style={{
        backgroundImage: "linear-gradient(120deg, var(--color-line), var(--color-bg) 70%)",
      }}
    >
      <div className="w-full max-w-5xl bg-surface border border-line rounded-2xl p-6 sm:p-10">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-cream">Complete Profile</h1>
          <p className="text-text-secondary mt-1">
            Please fill in the details to finish your profile setup.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

          <div className="flex flex-col items-center">
            <img
              src={imagePreview || userData.displayPicture || defaultDp}
              alt="default-image-icon"
              className="h-48 w-48 rounded-full object-cover border-2 border-line"
            />
            <label
              htmlFor="profile-image"
              className="mt-4 px-4 py-2 text-sm font-medium text-accent border border-accent rounded-lg bg-transparent hover:bg-accent hover:text-white active:scale-95 transition-all duration-200"
            >
              Upload Image
            </label>
            <input 
              className="hidden"
              id="profile-image"
              accept="image/*"
              onChange={handleImageUpload}
              type="file" />
            <p className="text-sm text-text-secondary mt-1 text-center lg:text-left">
              Max 3MB <span className="text-text-secondary/70">(optional)</span>
            </p>
          </div>

          <form 
            onSubmit={handleFormSubmit}
            ref={formRef}
            className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="firstname" className="text-sm font-medium text-text-primary">
                  First Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  placeholder="Enter your first name"
                  className="bg-bg border border-line text-text-primary placeholder:text-text-secondary/60 rounded-lg px-3 py-2 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="lastname" className="text-sm font-medium text-text-primary">
                  Last Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  placeholder="Enter your last name"
                  className="bg-bg border border-line text-text-primary placeholder:text-text-secondary/60 rounded-lg px-3 py-2 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="DOB" className="text-sm font-medium text-text-primary">
                  Date of Birth <span className="text-accent">*</span>
                </label>
                <input
                  id="DOB"
                  name="DOB"
                  type="date"
                  className="bg-bg border border-line text-text-primary rounded-lg px-3 py-2 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors [color-scheme:dark]"
                />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <span className="text-sm font-medium text-text-primary">
                  Gender <span className="text-accent">*</span>
                </span>
                <div className="flex items-center gap-4 h-[42px]">
                  <label htmlFor="gender-male" className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                    <input
                      id="gender-male"
                      value="male"
                      name="gender"
                      type="radio"
                      className="h-4 w-4 accent-accent"
                    />
                    Male
                  </label>
                  <label htmlFor="gender-female" className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                    <input
                      id="gender-female"
                      value="female"
                      name="gender"
                      type="radio"
                      className="h-4 w-4 accent-accent"
                    />
                    Female
                  </label>
                  <label htmlFor="gender-other" className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                    <input
                      id="gender-other"
                      value="other"
                      name="gender"
                      type="radio"
                      className="h-4 w-4 accent-accent"
                    />
                    Other
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="bio" className="text-sm font-medium text-text-primary">
                Bio <span className="text-text-secondary text-xs">(optional)</span>
              </label>
              <textarea
                rows={4}
                id="bio"
                name="bio"
                placeholder="About you..."
                className="bg-bg border border-line text-text-primary placeholder:text-text-secondary/60 rounded-lg px-3 py-2 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                className="h-4 w-4 rounded accent-accent cursor-pointer"
              />
              <label htmlFor="isPublic" className="text-sm text-text-primary cursor-pointer">
                Set to Private
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-accent hover:bg-accent-soft text-cream font-medium rounded-lg py-2.5 transition-colors"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
};

export default CompleteProfile;