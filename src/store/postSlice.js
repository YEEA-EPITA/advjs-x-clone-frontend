import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { xcloneApi } from '../constants/axios';
import { postRequests } from '../constants/requests';

// Asynchronous thunk action
export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ content, mediaFile, location = 'Paris', poll }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (mediaFile) {
        formData.append('media', mediaFile);
      }
      formData.append('location', location);

      if (poll) {
        formData.append('poll', JSON.stringify(poll)); 
      }

      const res = await xcloneApi.post(postRequests.createPost, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
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
    items: [],
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
        state.items.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
