import { useSelector } from "react-redux"
import LoadingSpinner from "./LoadingSpinner"
import { Outlet, Navigate } from "react-router-dom"


const PublicRoute = () => {
  const { status } = useSelector(state => state.user)

  if(status == "idle" || status == "loading"){
    return (
      <div className="min-h-screen bg-bg text-cream flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  if(status == "succeeded"){
    return <Navigate to="/home" replace />
  }
  return <Outlet />
}

export default PublicRoute