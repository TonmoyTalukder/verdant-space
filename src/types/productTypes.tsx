export type TSale = {
  onSale: string;
  onSaleDiscountPercentage: number;
  _id: string;
};

export type TProduct = {
  date: string | number | Date;
  createdAt: string;
  description: string;
  image: string;
  placeholderImages: string[];
  inventory: {
    quantity: number;
    inStock: boolean;
    _id: string;
  };
  isDeleted: boolean;
  name: string;
  price: number;
  productId: string;
  orderedQuantity: number;
  rating: number;
  sale: TSale;
  seasonal: string;
  tags: string[];
  type: string;
  updatedAt: string;
  _id: string;
};
