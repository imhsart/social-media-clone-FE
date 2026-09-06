import { useState, useRef } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { isEmail, isStrongPassword } from "validator"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"
const backendUrl = import.meta.env.VITE_BACKEND_URL


const SignUpPage = () => {
  const [formStep, setFormStep] = useState("send")
  const [isLoading, setIsLoading] = useState(false)
  const emailRef = useRef(null)
  const userRef = useRef(null)
  const passRef = useRef(null)
  const otpRef = useRef(null)
  const navigate = useNavigate()


  async function handleSubmit(e){
    e.preventDefault()
    if(emailRef.current.value === ""){
      toast.error("Please enter an email.")
      return
    }
    if(!isEmail(emailRef.current.value)){
      toast.error("Please enter a valid email.")
      return
    }
    if(formStep === "send"){
      handleSendingOtp()
    }else if(formStep === "verify"){
      handleVerifyOtp()
    }else if(formStep === "signup"){
      handleSignup()
    }
  }
  async function handleSendingOtp(){
    try{
      const response = await axios.post(`${backendUrl}/auth/send-otp`, {email: emailRef.current.value})
      const data = response.data
      if(data.success){
        if(data?.alreadyVerified){
          toast.success(data.message)
          setFormStep("signup")
        }else{
          toast.success(`OTP sent to ${emailRef.current.value}`)
          setFormStep("verify")
        }
      }
    }
    catch(error){
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  async function handleVerifyOtp(){
    if(otpRef.current.value === ""){
      toast.error("Please enter the OTP.")
      return
    }
    if(!/^\d{6}$/.test(otpRef.current.value)){
      toast.error("Please enter a valid 6-digit OTP.")
      return
    }
    try{
      const response = await axios.post(`${backendUrl}/auth/verify-otp`, {email: emailRef.current.value, otp: otpRef.current.value})
      const data = response.data
      if(data.success){
        toast.success(data.message)
        setFormStep("signup")
      }
    }
    catch(error){
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  async function handleSignup(){
    if(userRef.current.value === "" || passRef.current.value === ""){
      toast.error("Please enter your username and password.")
      return
    }
    if(userRef.current.value.length < 4 || userRef.current.value.length > 15){
      toast.error("Username must be 4 to 15 characters long.")
      return
    }
    if(!isStrongPassword(passRef.current.value)){
      toast.error("Please enter a stronger password.")
      return
    }
    try{
      setIsLoading(true)
      const response = await axios.post(`${backendUrl}/auth/signup`, {email: emailRef.current.value, username: userRef.current.value, password: passRef.current.value})
      const data = response.data
      if(data.success){
        toast.success(data.message)
        navigate("/login")
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
        onSubmit={handleSubmit}
        className="bg-surface w-full max-w-md px-8 py-10 rounded-2xl border border-line shadow-xl"
      >
        <h1 className="text-center mb-8 text-2xl text-cream font-bold tracking-tight">
          Sign Up
        </h1>
 
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm text-text-secondary" htmlFor="email">
            Email
          </label>
          <div className="flex gap-2">
            <input
              id="email"
              type="text"
              ref={emailRef}
              placeholder="Enter your email"
              disabled={formStep === "verify" || formStep === "signup"}
              className="flex-1 min-w-0 bg-bg text-text-primary placeholder-text-secondary/60 rounded-lg px-4 py-2.5 outline-none border border-line focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {formStep !== "verify" && formStep !== "signup" && (
              <button
                className="shrink-0 bg-accent text-text-primary font-medium px-4 py-2.5 rounded-lg hover:bg-accent-soft transition-colors cursor-pointer"
                type="submit"
              >
                Send OTP
              </button>
            )}
          </div>
        </div>
        {formStep === "verify" && (
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-sm text-text-secondary" htmlFor="otp">
              OTP
            </label>
            <div className="flex gap-2">
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                ref={otpRef}
                maxLength={6}
                className="flex-1 min-w-0 bg-bg text-text-primary placeholder-text-secondary/60 rounded-lg px-4 py-2.5 outline-none border border-line focus:border-accent transition-colors tracking-widest"
              />
              <button
                type="submit"
                className="shrink-0 bg-accent text-text-primary font-medium px-4 py-2.5 rounded-lg hover:bg-accent-soft transition-colors cursor-pointer"
              >
                Verify OTP
              </button>
            </div>
            <button
              type="button"
              onClick={handleSendingOtp}
              className="self-end text-sm text-text-secondary hover:text-accent transition-colors mt-1 cursor-pointer"
            >
              Resend OTP
            </button>
          </div>
        )}
        {formStep === "signup" && (
          <>
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-sm text-text-secondary" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                ref={userRef}
                className="bg-bg text-text-primary placeholder-text-secondary/60 rounded-lg px-4 py-2.5 outline-none border border-line focus:border-accent transition-colors"
              />
            </div>
 
            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-sm text-text-secondary" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                ref={passRef}
                className="bg-bg text-text-primary placeholder-text-secondary/60 rounded-lg px-4 py-2.5 outline-none border border-line focus:border-accent transition-colors"
              />
            </div>
 
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-accent text-text-primary font-medium py-2.5 rounded-lg hover:bg-accent-soft transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "Sign Up"}
            </button>
          </>
        )}
        <p className="text-center text-sm text-text-secondary mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-accent font-medium hover:underline cursor-pointer"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  )
}

export default SignUpPage