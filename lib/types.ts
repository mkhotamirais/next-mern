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
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}
