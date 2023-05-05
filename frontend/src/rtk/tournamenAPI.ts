import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tournamentAPI = createApi({
    reducerPath: "tournamentAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api/`,
        prepareHeaders: (headers) => {
            // By default, if we have a token in the store, let's use that for authenticated requests
            const access = localStorage.getItem("access");
            console.log(access);
            if (access) {
                headers.set("Authorization", `JWT ${access}`);
            }
            headers.set("Accept", "*/*");
            return headers;
        },
    }),
    refetchOnFocus: true,
    endpoints: (build) => ({
        getMatchById: build.query({
            query: (search) => ({
                url: `match/${search.id}/`,
            }),
        }),
    }),
});
