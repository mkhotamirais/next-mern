export interface RegisterState {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  errors: {
    name?: string | string[];
    email?: string | string[];
    password?: string | string[];
    confirmPassword?: string | string[];
  };
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  password?: string;
  confirmPassword?: string;
}

export interface IProductcat {
  _id: string;
  name: string;
}

export interface IProducttag {
  _id: string;
  name: string;
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  tags: IProducttag[];
  imageUrl: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostcat {
  _id: string;
  name: string;
}

export interface IPost {
  _id: string;
  title: string;
  content: string;
  category: IPostcat;
  imageUrl: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TRoles = "user" | "editor" | "admin";

export interface IParams {
  q?: string;
  category?: string;
  tags?: string;
}

export interface ICart {
  _id: string;
  productId: IProduct;
  qty: number;
  price?: number;
}

export interface IOrder {
  _id: string;
  userId: string;
  items: ICart[];
  total: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: Date;
}
