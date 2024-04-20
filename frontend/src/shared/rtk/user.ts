import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "..";
const server_URL = import.meta.env.VITE_API_URL;
const removeTokensFromLocalStorage = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
type UserCredentials = {
  name: string;
  email: string;
  password: string;
};
type ModifyUserCredentials = {
  name?: string | null;
  email?: string | null;
  old_password?: string | null;
  new_password?: string | null;
};
export const uploadUserImage = createAsyncThunk(
  "users/image",
  async (formData: FormData, thunkAPI) => {
    try {
      const res = await fetch(`${server_URL}/api/v2/user/photo/`, {
        method: "PUT",
        headers: {
          Authorization: `JWT ${localStorage.getItem("access")}`
        },
        body: formData
      });
      if (res.status === 200) {
        return thunkAPI.fulfillWithValue("image uploaded");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const uploadTeamImage = createAsyncThunk(
  "users/image",
  async (
    { formData, teamId }: { formData: FormData; teamId: number },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${server_URL}/api/v2/team/${teamId}/photo/`, {
        method: "PUT",
        headers: {
          Authorization: `JWT ${localStorage.getItem("access")}`
        },
        body: formData
      });
      if (res.status === 200) {
        return thunkAPI.fulfillWithValue("image uploaded");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const uploadMatchResultImage = createAsyncThunk(
  "match/image",
  async (
    { formData, matchId }: { formData: FormData; matchId: number },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${server_URL}/api/v2/match/${matchId}/photo/`, {
        method: "PUT",
        headers: {
          Authorization: `JWT ${localStorage.getItem("access")}`
        },
        body: formData
      });
      if (res.status === 200) {
        return thunkAPI.fulfillWithValue("image uploaded");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const modifyUserCredentials = createAsyncThunk(
  "users/modify",
  async (credentials: ModifyUserCredentials, thunkAPI) => {
    const body = JSON.stringify(credentials);
    try {
      const res = await fetch(`${server_URL}/api/v2/user/credentials/`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`
        },
        body
      });
      if (res.status === 200) {
        return await res.json();
      } else {
        return thunkAPI.rejectWithValue(
          "Modifying user credentials failed(unprocessed http status code)"
        );
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(
        "Modifying user credentials failed with an error in a trycatch statement!)"
      );
    }
  }
);
export const googleAuthenticate = createAsyncThunk(
  "users/googleAuth",
  async ({ state, code }: { state: string; code: string }, thunkAPI) => {
    if (state && code && !localStorage.getItem("access")) {
      const details: any = {
        state,
        code
      };
      const formBody = Object.keys(details)
        .map(
          (key: string) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
        )
        .join("&");
      try {
        const res = await fetch(
          `${server_URL}/auth/o/google-oauth2/?${formBody}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );
        const data = await res.json();
        if (res.status === 201) {
          const { dispatch } = thunkAPI;
          const { access } = data;
          localStorage.setItem("access", access);
          dispatch(getUser(access));

          return data;
        } else {
          return thunkAPI.rejectWithValue("google auth failed!");
        }
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response.data);
      }
    } else {
      return thunkAPI.rejectWithValue("google auth cancelled!!");
    }
  }
);

export const discordAuthenticate = createAsyncThunk(
  "users/discordAuth",
  async ({ state, code }: { state: string; code: string }, thunkAPI) => {
    if (state && code && !localStorage.getItem("access")) {
      const details: any = {
        state,
        code
      };
      const formBody = Object.keys(details)
        .map(
          (key: string) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
        )
        .join("&");
      try {
        const res = await fetch(`${server_URL}/auth/o/discord/?${formBody}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        const data = await res.json();
        if (res.status === 201) {
          const { dispatch } = thunkAPI;
          const { access } = data;
          localStorage.setItem("access", access);
          dispatch(getUser(access));

          return data;
        } else {
          return thunkAPI.rejectWithValue("discord auth failed!");
        }
      } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response.data);
      }
    } else {
      return thunkAPI.rejectWithValue("discord auth cancelled!!");
    }
  }
);
type SignUpState = UserCredentials & {
  re_password: string;
};
export const register = createAsyncThunk(
  "users/register",
  async ({ name, email, password, re_password }: SignUpState, thunkAPI) => {
    const body = JSON.stringify({
      name,
      email,
      password,
      re_password
    });

    try {
      const res = await fetch(`${server_URL}/auth/users/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body
      });

      const data = await res.json();

      if (res.status === 201) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  "users/me",
  async (access: string, thunkAPI) => {
    try {
      const res = await fetch(`${server_URL}/auth/users/me/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `JWT ${access}`
        }
      });

      const data = await res.json();

      if (res.status === 200) {
        return data;
      } else {
        removeTokensFromLocalStorage();
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err: any) {
      removeTokensFromLocalStorage();
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "users/login",
  async (
    {
      email,
      password,
      keepTokens
    }: { email: string; password: string; keepTokens?: boolean },
    thunkAPI
  ) => {
    const body = JSON.stringify({
      email,
      password
    });
    try {
      const res = await fetch(`${server_URL}/auth/jwt/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body
      });

      const data = await res.json();

      if (res.status === 200) {
        const { dispatch } = thunkAPI;
        const { access, refresh } = data;
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        dispatch(getUser(access));
        return data;
      } else {
        if (!keepTokens) {
          removeTokensFromLocalStorage();
        }
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err: any) {
      if (!keepTokens) {
        removeTokensFromLocalStorage();
      }
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
export const activate = createAsyncThunk(
  "users/activate",
  async ({ uid, token }: { uid: string; token: string }, thunkAPI) => {
    const headers = {
      "Content-Type": "application/json"
    };
    const body = JSON.stringify({ uid, token });
    try {
      const res = await fetch(`${server_URL}/auth/users/activation/`, {
        body,
        headers,
        method: "POST"
      });
      if (res.status === 204) {
        return thunkAPI.fulfillWithValue("activation succeeded");
      } else {
        return thunkAPI.rejectWithValue("activate no good");
      }
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);
export const resetPassword = createAsyncThunk<string, string>(
  "users/reset_password",
  async (email, thunkAPI) => {
    try {
      const body = JSON.stringify({ email });
      const res = await fetch(`${server_URL}/auth/users/reset_password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body
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
type ResetPasswordState = {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
};
export const resetPasswordConfirm = createAsyncThunk(
  "users/reset_password",
  async (
    { uid, token, new_password, re_new_password }: ResetPasswordState,
    thunkAPI
  ) => {
    try {
      const body = JSON.stringify({
        uid,
        token,
        new_password,
        re_new_password
      });
      const res = await fetch(
        `${server_URL}/auth/users/reset_password_confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body
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

const getNewAccessToken = async (refresh: string) => {
  try {
    const res = await fetch(`${server_URL}/auth/jwt/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refresh
      })
    });
    const data: { access: string } = await res.json();
    return data.access;
  } catch (error) {
    return Promise.reject("access token refreshing failed!");
  }
};
export const checkAuth = createAsyncThunk(
  "users/verify",
  async (token: string, thunkAPI: any) => {
    try {
      const body = JSON.stringify({ token: token });

      const res = await fetch(`${server_URL}/auth/jwt/verify/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body
      });

      const data = await res.json();

      if (res.status === 200) {
        const { dispatch } = thunkAPI;
        const userState = thunkAPI.getState()?.user.userDetails as
          | IUser
          | null
          | undefined;
        if (userState) {
          return data;
        }
        dispatch(getUser(token));

        return data;
      } else {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          const newAccess = await getNewAccessToken(refresh);
          localStorage.setItem("access", newAccess);
          const { dispatch } = thunkAPI;
          dispatch(getUser(newAccess));
          return thunkAPI.fulfillWithValue("access token has been refreshed");
        } else {
          removeTokensFromLocalStorage();
          return thunkAPI.rejectWithValue(data);
        }
      }
    } catch (err: any) {
      removeTokensFromLocalStorage();
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

interface initialUserState {
  isAuthenticated: Boolean;
  userDetails: IUser | null;
  loading: Boolean;
  registered: Boolean;
  activated: Boolean;
  loginFail: Boolean;
}
const initialState: initialUserState = {
  isAuthenticated: false,
  userDetails: null,
  loading: false,
  registered: false,
  activated: false,
  loginFail: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetRegistered: (state) => {
      state.registered = false;
    },
    logout: (state) => {
      removeTokensFromLocalStorage();
      state.userDetails = null;
      state.isAuthenticated = false;
    }
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
        state.userDetails = action.payload;
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
      .addCase(googleAuthenticate.pending, (state) => {
        state.loading = true;
      })
      .addCase(googleAuthenticate.rejected, (state) => {
        state.loading = false;
        state.loginFail = true;
      })
      .addCase(googleAuthenticate.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(discordAuthenticate.pending, (state) => {
        state.loading = true;
      })
      .addCase(discordAuthenticate.rejected, (state) => {
        state.loading = false;
        state.loginFail = true;
      })
      .addCase(discordAuthenticate.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(modifyUserCredentials.pending, (state) => {
        state.loading = true;
      })
      .addCase(modifyUserCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = { ...state.userDetails, ...action.payload };
      })
      .addCase(modifyUserCredentials.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { resetRegistered, logout } = userSlice.actions;
export default userSlice.reducer;
