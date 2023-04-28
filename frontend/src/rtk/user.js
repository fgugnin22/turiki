import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const server_URL = import.meta.env.VITE_API_URL;
export const googleAuthenticate = createAsyncThunk(
  "users/googleAuth",
  async ({ state, code }, thunkAPI) => {
    if (state && code && !localStorage.getItem("access")) {
      const details = {
        state,
        code,
      };
      const formBody = Object.keys(details)
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
        )
        .join("&");
      try {
        const res = await fetch(
          `${server_URL}/auth/o/google-oauth2/?${formBody}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const data = await res.json();
        console.log(data);
        if (res.status === 200) {
          const { dispatch } = thunkAPI;
          const { access } = data;
          localStorage.setItem("access", access);
          dispatch(getUser(access));

          return data;
        } else {
          return thunkAPI.rejectWithValue(data);
        }
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
      }
    }
  }
);
export const register = createAsyncThunk(
  "users/register",
  async ({ name, email, password, re_password }, thunkAPI) => {
    const body = JSON.stringify({
      name,
      email,
      password,
      re_password,
    });

    try {
      const res = await fetch(`${server_URL}/auth/users/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await res.json();

      if (res.status === 201) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  "users/me",
  async (access, thunkAPI) => {
    try {
      const res = await fetch(`${server_URL}/auth/users/me/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `JWT ${access}`,
        },
      });

      const data = await res.json();

      if (res.status === 200) {
        return data;
      } else {
        localStorage.removeItem("access");
        console.log(1);

        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "users/login",
  async ({ email, password }, thunkAPI) => {
    const body = JSON.stringify({
      email,
      password,
    });
    try {
      const res = await fetch(`${server_URL}/auth/jwt/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await res.json();

      if (res.status === 200) {
        const { dispatch } = thunkAPI;
        const { access } = data;
        localStorage.setItem("access", access);
        dispatch(getUser(access));

        return data;
      } else {
        localStorage.removeItem("access");
        console.log(3);

        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      localStorage.removeItem("access");
      console.log(4);

      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const checkAuth = createAsyncThunk(
  "users/verify",
  async (token, thunkAPI) => {
    try {
      const body = JSON.stringify({ token: token });
      console.log(body);
      const res = await fetch(`${server_URL}/auth/jwt/verify/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: `JWT ${token}`,
        },
        body,
      });

      const data = await res.json();

      if (res.status === 200) {
        const { dispatch } = thunkAPI;

        dispatch(getUser(token));

        return data;
      } else {
        localStorage.removeItem("access");
        console.log(5);

        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      localStorage.removeItem("access");
      console.log(6);

      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// export const logout = createAsyncThunk(
//   "users/logout",
//   async (access, thunkAPI) => {
//     try {
//       const res = await fetch(`${server_URL}/auth/users/logout/`, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `JWT ${access}`,
//         },
//       });

//       const data = await res.json();

//       if (res.status === 200) {
//         localStorage.removeItem("access");
//         console.log(7);
//         return data;
//       } else {
//         return thunkAPI.rejectWithValue(data);
//       }
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data);
//     }
//   }
// );

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  registered: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetRegistered: (state) => {
      state.registered = false;
    },
    logout: (state) => {
      localStorage.removeItem("access");
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.registered = true;
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
      });
    // .addCase(logout.pending, (state) => {
    //   state.loading = true;
    // })
    // .addCase(logout.fulfilled, (state) => {
    //   state.loading = false;
    //   state.isAuthenticated = false;
    //   state.user = null;
    // })
    // .addCase(logout.rejected, (state) => {
    //   state.loading = false;
    // });
  },
});

export const { resetRegistered, logout } = userSlice.actions;
export default userSlice.reducer;
