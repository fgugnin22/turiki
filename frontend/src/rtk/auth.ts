import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authAPI = createApi({
    reducerPath: "auth",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/auth/`,
        prepareHeaders: (headers) => {
            headers.set("Accept", "application/json");
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    refetchOnFocus: true,
    endpoints: (build) => ({
        registerUser: build.mutation({
            query: (formData) => ({
                url: `users/`,
                method: "POST",
                body: formData,
            }),
        }),
        activateUser: build.mutation({
            query: ({ uid, token }) => ({
                url: `users/activation/`,
                method: "POST",
                body: { uid, token },
            }),
        }),
        googleAuth: build.mutation({
            query: ({ state, code }) => {
                const details: any = {
                    state,
                    code,
                };

                const formBody = Object.keys(details)
                    .map(
                        (key) =>
                            encodeURIComponent(key) +
                            "=" +
                            encodeURIComponent(details[key])
                    )
                    .join("&");
                return {
                    url: `o/google-oauth2/?${formBody}`,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                };
            },
        }),
        login: build.mutation({
            query: ({ email, password }) => ({
                url: `jwt/create/`,
                method: "POST",
                body: {
                    email,
                    password,
                },
            }),
        }),
        resetPassword: build.mutation({
            query: ({ email }) => ({
                url: `users/reset_password/`,
                method: "POST",
                body: { email },
            }),
        }),
        resetPasswordConfirm: build.mutation({
            query: ({ uid, token, new_password, re_new_password }) => ({
                url: `users/reset_password_confirm/`,
                method: "POST",
                body: { uid, token, new_password, re_new_password },
            }),
        }),
        checkAccess: build.mutation({
            query: ({ access }) => ({
                url: `jwt/verify/`,
                method: "POST",
                body: {
                    token: access,
                },
                
            }),
        }),
        getUser: build.query({
            query: ({ access }) => ({
                url: `users/me/`,
                headers: {
                    Authorization: `JWT ${access}`,
                },
            }),
        }),
    }),
});
