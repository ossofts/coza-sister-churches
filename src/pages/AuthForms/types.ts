import { User } from "@/store/types";

export type AuthInputs = {
  email: string;
  password: string;
};

export type RegisterInputs = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  password: string;
  confirmPassword: string;
};

export type UpdatePasswordType = Pick<RegisterInputs, "password" | "confirmPassword">;

export type LoginResponse = {
  profile: User;
  token: {
    expiresIn: number;
    token: string;
    refreshToken: string;
  };
};
