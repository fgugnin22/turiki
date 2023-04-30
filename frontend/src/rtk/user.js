import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const server_URL = import.meta.env.VITE_API_URL;
export const googleAuthenticate = createAsyncThunk(
  "users/googleAuth",
  async ({ state, code }, thunkAPI) => {
    console.log(1);
    if (state && code && !localStorage.getItem("access")) {
      console.log(2);
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
        console.log(data, res);
        if (res.status === 201) {
          const { dispatch } = thunkAPI;
          const { access } = data;
          localStorage.setItem("access", access);
          dispatch(getUser(access));

          return data;
        } else {
          return thunkAPI.rejectWithValue("google auth failed!");
        }
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
      }
    } else {
      console.log(3);
      return thunkAPI.rejectWithValue("google auth cancelled!!");
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
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
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
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      localStorage.removeItem("access");
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
export const activate = createAsyncThunk(
  "users/activate",
  async ({ uid, token }, thunkAPI) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ uid, token });
    try {
      const res = await axios.post(
        `${server_URL}/auth/users/activation/`,
        body,
        config
      );
      if (res.status === 204) {
        thunkAPI.fulfillWithValue("activation succeeded");
      }
    } catch (err) {
      thunkAPI.rejectWithValue(err);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "users/reset_password",
  async (email, thunkAPI) => {
    try {
      const body = JSON.stringify({ email });
      const res = await fetch(`${server_URL}/auth/users/reset_password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      if (res.status === 204) {
        return thunkAPI.fulfillWithValue("password_reset_email_sent");
      } else {
        return thunkAPI.rejectWithValue("password_reset_server_error");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue("password_reset_aborted");
    }
  }
);
export const resetPasswordConfirm = createAsyncThunk(
  "users/reset_password",
  async ({ uid, token, new_password, re_new_password }, thunkAPI) => {
    try {
      const body = JSON.stringify({
        uid,
        token,
        new_password,
        re_new_password,
      });
      const res = await fetch(
        `${server_URL}/auth/users/reset_password_confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      );
      if (res.status === 204) {
        return thunkAPI.fulfillWithValue("password_reset_confirmed");
      } else {
        return thunkAPI.rejectWithValue("password_reset_confirm_server_error");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue("password_reset_confirm_aborted");
    }
  }
);
export const checkAuth = createAsyncThunk(
  "users/verify",
  async (token, thunkAPI) => {
    try {
      const body = JSON.stringify({ token: token });

      const res = await fetch(`${server_URL}/auth/jwt/verify/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      localStorage.removeItem("access");
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  registered: false,
  activated: false,
  loginFail: false,
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
        state.loginFail = false;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.loginFail = true;
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
      })
      .addCase(activate.fulfilled, (state) => {
        state.activated = true;
      })
      .addCase(activate.rejected, (state) => {
        state.activated = false;
      })
      .addCase(googleAuthenticate.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      });
  },
});

export const { resetRegistered, logout } = userSlice.actions;
export default userSlice.reducer;
