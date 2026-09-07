import { useSelector } from "react-redux"
import LoadingSpinner from "./LoadingSpinner"
import { Outlet, Navigate} from "react-router-dom"


const ProtectedRoute = () => {
  const { status, data } = useSelector(state => state.user)

  if(status == "idle" || status == "loading"){
    return (
      <div className="min-h-screen bg-bg text-cream flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  if(status == "failed"){
    return <Navigate to="/" replace />
  }
  if(status == "succeeded" && !data.isProfileComplete){
    return <Navigate to="/complete-profile" replace />
  }
  
  return <Outlet />
}

export default ProtectedRoute