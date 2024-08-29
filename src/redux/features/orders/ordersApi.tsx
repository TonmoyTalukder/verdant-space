import { baseApi } from "../../api/baseApi";

const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "/api/orders",
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    getSingleOrder: builder.query({
      query: (orderId) => ({
        url: `/api/orders/${orderId}`,
        method: "GET",
      }),
    }),

    addOrder: builder.mutation({
      query: (data) => {
        return {
          url: "/api/orders",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["order"],
    }),
    updateOrder: builder.mutation({
      query: ({ id, body }) => {
        return {
          url: `/api/orders/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => {
        return {
          url: `/api/orders/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useAddOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} = ordersApi;
