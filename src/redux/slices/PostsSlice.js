import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetUser } from "./UserSlice";
const backendUrl = import.meta.env.VITE_BACKEND_URL


const initialState = {
  items: [],
  page: 0,
  hasMore: false,
  status: "idle",
  error: null
}

const fetchAllPosts = createAsyncThunk("posts/fetchAllPosts", async ({ page = 1 } = {}, { getState, rejectWithValue }) => {
  try{
    const myId = getState().user.data.userId
    const response = await axios.get(`${backendUrl}/post/users/${myId}/get-posts`, { params: { page }, withCredentials: true })
    return { 
      posts: response.data.data, 
      page: response.data.page,
      hasMore: response.data.hasMore
    }
  }
  catch(error){
    return rejectWithValue(error?.response?.data?.message || "Failed to fetch posts.")
  }
},
{
  condition: ({ page = 1 } = {}, { getState }) => {
    const { status, hasMore } = getState().posts
    if(status === "loading"){
      return false
    }
    if(page === 1){
      return status === "idle" || status === "failed"
    }
    return hasMore
  }
})


const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: (state, { payload }) => { state.items.unshift(payload)},
    postUpdated: (state, { payload }) => { 
      const i = state.items.findIndex((p) => p._id === payload._id)
      if(i !== -1) state.items[i] = payload
    },
    postDeleted: (state, { payload: postId }) => { state.items = state.items.filter((p) => p._id !== postId)}
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchAllPosts.fulfilled, (state, { payload }) => {
        if(payload.page === 1){
          state.items = payload.posts
        }else{
          const seen = new Set(state.items.map((p) => p._id))
          state.items.push(...payload.posts.filter((p) => !seen.has(p._id)))
        }
        state.page = payload.page
        state.hasMore = payload.hasMore
        state.status = "succeeded"
      })
      .addCase(fetchAllPosts.rejected, (state, { payload }) => {
        state.status = "failed"
        state.error = payload
      })
      .addCase(resetUser, () => initialState)
  }
})

export { fetchAllPosts }
export const { postAdded, postUpdated, postDeleted } = postsSlice.actions
export default postsSlice.reducer