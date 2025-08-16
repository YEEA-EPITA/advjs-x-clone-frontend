import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { xcloneApi } from '../constants/axios';
import { postRequests } from '../constants/requests';

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (payload, thunkAPI) => {
    try {
      const { content, mediaFile, location = 'Paris', poll, hashtags, mentions } = payload;

      const formData = new FormData();
      formData.append('content', content);
      if (mediaFile) formData.append('media', mediaFile);
      formData.append('location', location);
      if (poll) formData.append('poll', JSON.stringify(poll));
      if (hashtags?.length) formData.append('hashtags', JSON.stringify(hashtags));
      if (mentions?.length) formData.append('mentions', JSON.stringify(mentions));

      const res = await xcloneApi.post(postRequests.createPost, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("user"))?.token}`,
        },
      });

      return res.data.post;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Error');
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default postSlice.reducer;