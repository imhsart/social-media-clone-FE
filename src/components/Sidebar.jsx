import { NavLink } from "react-router-dom"
import { Home, Compass, Bell, MessageCircle, Bookmark, Users, CircleUserRound, LogOut } from "lucide-react"
import sidebarLogo from "../assets/samyogah_logo.png"
import mdLogo from "../assets/md_logo.png"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { resetUser } from "../redux/slices/UserSlice"
const backendUrl = import.meta.env.VITE_BACKEND_URL

const navItems = [
  { to: "/home", label: "Home", Icon: Home },
  { to: "/explore", label: "Explore", Icon: Compass },
  { to: "/notifications", label: "Notifications", Icon: Bell },
  { to: "/messages", label: "Messages", Icon: MessageCircle },
  { to: "/saved", label: "Saved", Icon: Bookmark },
  { to: "/friends", label: "Friends", Icon: Users },
  { to: "/profile", label: "Profile", Icon: CircleUserRound },
]
const bottomBarItems = navItems.filter(item => (
  item.label !== "Notifications" && item.label !== "Saved"
))
// navitems can change later

const Sidebar = () => {
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
    <>
      <div
        className="hidden md:flex md:flex-col md:justify-between bg-bg border-r border-line fixed left-0 top-0 bottom-0 z-50 w-20 lg:w-[15%] lg:min-w-[220px] lg:max-w-[280px]"
      >
        <div>
          <div className="flex items-center justify-center lg:justify-start px-2 lg:px-5 py-3">
            <img 
              src={mdLogo}
              alt="sidebar-logo"
              className="hidden md:block h-8 w-8 object-contain lg:hidden"
            />
            <img 
              src={sidebarLogo} 
              alt="sidebar-logo"
              className="hidden lg:block h-8 w-auto max-w-full object-contain" 
            />
          </div>
          <div className="flex flex-col">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative flex items-center gap-4 px-2 lg:px-5 py-3 justify-center lg:justify-start transition-colors ${
                    isActive
                      ? "text-text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
                    )}
                    <Icon
                      size={22}
                      strokeWidth={2}
                      className={`shrink-0 ${isActive ? "text-accent" : ""}`}
                    />
                    <span className="hidden lg:inline">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="px-2 lg:px-5 py-6 border-t border-line"> 
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="group flex items-center gap-4 justify-center lg:justify-start w-full rounded-lg px-2 lg:px-3 py-2.5 text-red-400 transition-all shadow-[0_0_10px_rgba(239,68,68,0.35)] hover:text-red-300 hover:bg-red-500/10 hover:shadow-[0_0_12px_rgba(239,68,68,0.6)]"
          >
            <LogOut size={20} strokeWidth={2} className="shrink-0" />
            <span className="hidden lg:inline text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* for small screens / mobile: fixed bottom icon bar*/}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg border-t border-line flex items-center justify-around px-1"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {bottomBarItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className="relative flex flex-1 flex-col items-center justify-center py-3 text-text-secondary aria-[current=page]:text-accent"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-0 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-b-full bg-accent" />
                )}
                <Icon
                  size={22}
                  strokeWidth={2}
                  className={isActive ? "text-accent" : "text-text-secondary"}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </>
  )
}

export default Sidebar