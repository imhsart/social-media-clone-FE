import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

const HomeLayout = () => {
  return (
    <div className="font-mono">
      <Sidebar />
      <Navbar />
      <main className="pt-16 pb-16 md:pt-20 md:pb-2 md:pl-20 lg:pl-[clamp(220px,15%,280px)] bg-bg">
        <Outlet />
      </main>
    </div>
  )
}

export default HomeLayout