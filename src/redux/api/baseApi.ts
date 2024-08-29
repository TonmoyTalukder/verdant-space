import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'https://verdant-space-server.vercel.app/',
        credentials: 'include',
    }),
    tagTypes: ['product', 'singleProduct', 'order', 'user', 'singleUser', 'article'],
    endpoints: () => ({}),
});