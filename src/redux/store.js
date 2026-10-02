import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice"
import postsReducer from "./slices/PostsSlice"

const Store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer
  }
})

export default Store