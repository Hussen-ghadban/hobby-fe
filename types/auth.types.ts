// ====== REQUEST TYPES ======
export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// ====== RESPONSE TYPES ======
export interface RegisterResponse {
  message: string;
  parent: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
}

export interface LoginResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface RefreshTokenResponse {
  data:{accessToken: string;}
}
