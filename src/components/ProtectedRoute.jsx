import { useSelector } from "react-redux"
import LoadingSpinner from "./LoadingSpinner"
import { Outlet, Navigate, useLocation} from "react-router-dom"


const ProtectedRoute = () => {
  const { status, data } = useSelector(state => state.user)
  const location = useLocation()

  if(status == "idle" || status == "loading"){
    return (
      <div className="min-h-screen bg-bg text-cream flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  if(status == "failed"){
    return <Navigate to="/login" replace />
  }
  if(status == "succeeded" && !data.isProfileComplete && location.pathname !== "/complete-profile"){
    return <Navigate to="/complete-profile" replace />
  }
  if(status == "succeeded" && data.isProfileComplete && location.pathname === "/complete-profile"){
    return <Navigate to="/home" replace />
  }
  
  return <Outlet />
}

export default ProtectedRoute