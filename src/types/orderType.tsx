export type TUser = {
    name: string;
    email: string;
    password: string;
    contactNo: string;
    address: string;
    isAdmin: boolean;
    isDeleted?: boolean; // Add soft delete field
  };

export type TPayment = {
  method: string;
  status: string;
  price: number;
};

export type TOrderProduct = {
  productId: string;
  quantity: number;
};

export type TOrderDetails = {
  status: string;
  delivery: boolean;
  adminApproval: boolean;
  checkoutStatus: boolean;
};

export type TOrder = {
  userId: string;
  userDetails?: Omit<TUser, 'password'>;
  products: TOrderProduct[];
  address: string;
  payment: TPayment;
  order: TOrderDetails;
  isDeleted: boolean;
};
