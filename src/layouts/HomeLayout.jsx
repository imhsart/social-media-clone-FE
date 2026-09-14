import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

const HomeLayout = () => {
  return (
    <div>
      <Sidebar />
      <Navbar />
      <main className="pt-16 md:pt-20 pb-16 md:pb-0 md:pl-20 lg:pl-[clamp(220px,15%,280px)]">
        <Outlet />
      </main>
    </div>
  )
}

export default HomeLayout