import { useState } from "react"
import { Search, SquarePen, Users, MessageCircle, Bell, ChevronDown } from "lucide-react"
import defaultDp from "../assets/default_profile_picture.png"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { resetUser } from "../redux/slices/UserSlice"
const backendUrl = import.meta.env.VITE_BACKEND_URL

const Navbar = () => {
  const { data: userData } = useSelector(state => state.user)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  async function handleLogout(){
    const confirmLogout = window.confirm("Do you want to log out?")
    if(!confirmLogout){
      return
    }
    try{
      const response = await axios.post(`${backendUrl}/auth/logout`, {}, {withCredentials: true})
      if(response.data.success){
        dispatch(resetUser())
        toast.success(response.data.message)
        navigate("/login")
      }
    }
    catch(error){
      console.log(error)
      toast.error(error.response.data.message || "Failed to log out.")
    }
  }

  return (
    <header className="fixed top-0 right-0 left-0 md:left-20 lg:left-[clamp(220px,15%,280px)] z-40 flex h-16 md:h-20 items-center justify-between border-b border-line bg-bg px-4 md:px-6 lg:px-8">
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input 
          type="text"
          placeholder="Search for people, posts, or topics..."
          className="w-full rounded-full border border-line bg-surface py-2.5 pl-11 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="flex items-center gap-4 md:gap-6 lg:gap-7 pl-3">
        <button
          aria-label="Create post"
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <SquarePen size={22} strokeWidth={1.75} />
        </button>
        <button
          aria-label="Friends"
          className="hidden md:inline-flex text-text-secondary hover:text-text-primary transition-colors"
        >
          <Users size={22} strokeWidth={1.75} />
        </button>
        <button
          aria-label="Messages"
          className="hidden md:inline-flex text-text-secondary hover:text-text-primary transition-colors"
        >
          <MessageCircle size={22} strokeWidth={1.75} />
        </button>
        <button
          aria-label="Notifications"
          className="relative hidden md:inline-flex text-text-secondary hover:text-text-primary transition-colors"
        >
          <Bell size={22} strokeWidth={1.75} />
          {/* here will be the notification condition for notif number */}
          {/* {notificationCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-cream">
              {notificationCount}
            </span>
          )} */}
        </button>
        <div className="relative z-50">
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="flex items-center gap-1.5"
          >
            <img
              src={userData?.displayPicture || defaultDp}
              alt="profile-picture"
              className="h-9 w-9 rounded-full object-cover ring-1 ring-line"
            />
            <ChevronDown 
              size={16}
              className={`text-text-secondary transition-transform ${menuOpen ?  "rotate-180" : ""}`}
            />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-md border border-line bg-surface py-1 shadow-lg">
              <Link
                to="/notifications"
                onClick={() => setMenuOpen(false)}
                className="md:hidden flex items-center justify-between px-4 py-2 text-sm text-text-primary hover:bg-accent-soft"
              >
                Notifications
                {/* {notificationCount > 0 && <span className="text-accent text-xs">{notificationCount}</span>} */}
              </Link>
              <Link
                to="/saved"
                onClick={() => setMenuOpen(false)}
                className="md:hidden block px-4 py-2 text-sm text-text-primary hover:bg-accent-soft"
              >
                Saved
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-text-primary hover:bg-accent-soft"
              >
                View Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm text-text-primary hover:bg-accent-soft"
              >
                Settings
              </Link>
              <button 
                onClick={() => {
                  setMenuOpen(prev => !prev)
                  handleLogout()
                }}
                className="block w-full px-4 py-2 text-left text-sm text-accent hover:bg-accent-soft">
                Log out
              </button>
            </div>
          )}
        </div>
        {menuOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
          )}
      </div>
    </header>
  )
}

export default Navbar