import { baseApi } from "../../api/baseApi";

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: "/api/products",
        method: "GET",
      }),
      providesTags: ["product"],
    }),

    getSingleProduct: builder.query({
      query: (productId) => ({
        url: `/api/products/${productId}`,
        method: "GET",
      }),
      providesTags: ["singleProduct"],
    }),

    searchProducts: builder.query({
      query: ({ searchTerm, type }) => {
        // Build query string
        let queryParams = `searchTerm=${encodeURIComponent(searchTerm)}`;

        if (type) {
          queryParams += `&type=${encodeURIComponent(type)}`;
        }
        
        return {
          url: `/api/products?${queryParams}`,
          method: "GET",
        };
      },
    }),
    addProduct: builder.mutation({
      query: (data) => {
        return {
          url: "/api/products",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["product"],
    }),
    updateProduct: builder.mutation({
      query: (products) => {
        return {
          url: `/api/products/${products.productId}`,
          method: "PUT",
          body: products,
        };
      },
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation({
      query: (products) => {
        return {
          url: `/api/products/${products.productId}`,
          method: "DELETE",
          body: products,
        };
      },
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductMutation,
} = productsApi;
