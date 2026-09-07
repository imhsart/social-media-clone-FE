import { Outlet } from "react-router-dom"

const HomeLayout = () => {
  return (
    <div>
      {/* navbar will be here */}
      <Outlet />
    </div>
  )
}

export default HomeLayout