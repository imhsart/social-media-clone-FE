import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import SignUpPage from "./pages/SignUpPage"
import LandingPage from "./pages/LandingPage"
import PublicRoute from "./components/PublicRoute"
import ProtectedRoute from "./components/ProtectedRoute"
import CompleteProfile from "./pages/CompleteProfile"
import HomeLayout from "./layouts/HomeLayout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import { Toaster } from "react-hot-toast"
import { fetchCurrentUser } from "./redux/slices/UserSlice"
import { useDispatch } from "react-redux"

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  return (
    <div>
      <Toaster />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<HomeLayout />}>
            <Route path="home" element={<HomePage />} />
          </Route>
          <Route path="/complete-profile" element={<CompleteProfile />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App