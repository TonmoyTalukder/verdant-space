import { baseApi } from "../../api/baseApi";

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/api/users",
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    getSingleUser: builder.query({
      query: (email) => {
        return {
          url: `/api/users/${email}`,
          method: "GET",
        };
      },
      providesTags: ["singleUser"],
    }),

    addUser: builder.mutation({
      query: (data) => {
        return {
          url: "/api/users",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["user"],
    }),

    updateUser: builder.mutation({
      query: (users) => {
        return {
          url: `/api/users/${users.id}`,
          method: "PUT",
          body: users,
        };
      },
      invalidatesTags: ["user"],
    }),

    deleteUser: builder.mutation({
      query: (user) => {
        return {
          url: `/api/user/${user.id}`,
          method: "DELETE",
          body: user,
        };
      },
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} = productsApi;
