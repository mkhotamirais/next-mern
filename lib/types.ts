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
  price: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  tags: IProducttag[];
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
}

export type TRoles = "user" | "editor" | "admin";
