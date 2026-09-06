import { useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { isEmail } from "validator"
import LoadingSpinner from "../components/LoadingSpinner"
const backendUrl = import.meta.env.VITE_BACKEND_URL


const LoginPage = () => {
  const userRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const passRef = useRef(null)
  const navigate = useNavigate()

  async function handleLogin(e){
    e.preventDefault()
    if(userRef.current.value === "" || passRef.current.value === ""){
      toast.error("Please fill in all the fields.")
      return
    }
    let userKey = "username"
    if(isEmail(userRef.current.value)){
      userKey = "email"
    }
    try{
      setIsLoading(true)
      const response = await axios.post(`${backendUrl}/auth/login`, {
        [userKey]: userRef.current.value,
        password: passRef.current.value
      }, {withCredentials: true})
      const data = response.data
      if(data.success){
        toast.success(data.message)
        navigate("/home")
      }
    }
    catch(error){
      console.log(error)
      toast.error(error.response.data.message)
    }
    finally{
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center font-mono px-4"
      style={{
        backgroundImage: "linear-gradient(120deg, var(--color-line), var(--color-bg) 70%)",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-surface w-full max-w-md px-8 py-10 rounded-2xl border border-line shadow-xl"
      >
        <h1 className="text-center mb-8 text-2xl text-cream font-bold tracking-tight">
          Log In
        </h1>
 
        <div className="flex flex-col gap-1.5 mb-4">
          <label htmlFor="user" className="text-sm text-text-secondary">
            Username / Email
          </label>
          <input
            id="user"
            type="text"
            ref={userRef}
            placeholder="Enter your username or email"
            disabled={isLoading}
            className="flex-1 min-w-0 bg-bg text-text-primary placeholder-text-secondary/60 rounded-lg px-4 py-2.5 outline-none border border-line focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
 
        <div className="flex flex-col gap-1.5 mb-6">
          <label htmlFor="password" className="text-sm text-text-secondary">
            Password
          </label>
          <input
            id="password"
            type="password"
            ref={passRef}
            placeholder="Enter your password"
            disabled={isLoading}
            className="flex-1 min-w-0 bg-bg text-text-primary placeholder-text-secondary/60 rounded-lg px-4 py-2.5 outline-none border border-line focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
 
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-accent text-text-primary font-medium py-2.5 rounded-lg hover:bg-accent-soft transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : "Log In"}
        </button>
 
        <p className="text-center text-sm text-text-secondary mt-6">
          Don't have an account yet?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-accent font-medium hover:underline cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}

export default LoginPage