import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        // baseUrl: 'http://localhost:5000/',
        baseUrl: 'https://verdantspace-server.vercel.app/',
        credentials: 'include',
    }),
    tagTypes: ['product', 'singleProduct', 'order', 'singleOrder', 'user', 'singleUser', 'article'],
    endpoints: () => ({}),
});