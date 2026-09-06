import { Routes, Route } from "react-router-dom"
import SignUpPage from "./pages/SignUpPage"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import { Toaster } from "react-hot-toast"

const App = () => {

  return (
    <div>
      <Toaster />
      <Routes>
        {/* <Route element={<PublicRoute />}> */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        {/* </Route> */}
      </Routes>
    </div>
  )
}

export default App