// articlesApi.tsx
import { baseApi } from "../../api/baseApi";

const articlesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getArticles: builder.query({
            query: () => ({
                url: '/api/articles',
                method: 'GET',
            }),
            providesTags: ['article'],
        }),

        getSingleArticle: builder.query({
            query: (articleId) => ({
                url: `/api/articles/${articleId}`,
                method: 'GET',
            }),
            providesTags: ['article'],
        }),

        addArticle: builder.mutation({
            query: (data) => ({
                url: '/api/articles',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['article'],
        }),

        updateArticle: builder.mutation({
            query: ({ id, body }) => ({
                url: `/api/articles/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['article'],
        }),

        deleteArticle: builder.mutation({
            query: (id) => ({
                url: `/api/articles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['article'],
        }),
    }),
});

export const {
    useGetArticlesQuery,
    useGetSingleArticleQuery,
    useAddArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
} = articlesApi;
