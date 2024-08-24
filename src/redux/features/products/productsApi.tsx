import { baseApi } from "../../api/baseApi";

const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts : builder.query({
            query: () => ({
                url: '/api/products',
                method: 'GET',
            })
        }),

        getSingleProduct: builder.query({
            query: (productId) => ({
              url: `/api/products/${productId}`, 
              method: 'GET',
            }),
          }),

        searchProducts: builder.query({
            query: ({ searchTerm, type }) => {
                // Build query string
                let queryParams = `searchTerm=${encodeURIComponent(searchTerm)}`;
                
                if (type) {
                    queryParams += `&type=${encodeURIComponent(type)}`;
                }

                console.log("query: ", queryParams);

                return {
                    url: `/api/products?${queryParams}`,
                    method: 'GET',
                };
            }
        }),
    }),
})

export const { useGetProductsQuery, useSearchProductsQuery, useGetSingleProductQuery } = productsApi;