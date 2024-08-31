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
      providesTags: ["singleOrder"],
    }),

    addOrder: builder.mutation({
      query: (data) => {
        return {
          url: "/api/orders",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["order", "singleOrder", "singleProduct", "product"],
    }),
    updateOrder: builder.mutation({
      query: ({ id, body }) => {
        return {
          url: `/api/orders/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["order", "singleOrder", "singleProduct", "product"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => {
        return {
          url: `/api/orders/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["order", "singleOrder", "singleProduct", "product"],
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
