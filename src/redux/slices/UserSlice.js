import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL

const initialState = {
  status: "idle",
  data: null,
  error: null
}

const fetchCurrentUser = createAsyncThunk("user/fetchCurrentUser", async (_, {rejectWithValue}) => {
  try{
    const response = await axios.get(`${backendUrl}/auth/me`, {withCredentials: true})
    return response.data.data
  }
  catch(error){
    return rejectWithValue(error?.response?.data?.message || "Failed to fetch user.")
  }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.status = "failed"
      state.data = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
        state.data = null
      })
  }
})

export { fetchCurrentUser }
export const { resetUser } = userSlice.actions
export default userSlice.reducer