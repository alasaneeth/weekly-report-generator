import apiClient from '../../../api/apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'TeamMember' | 'Manager';
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  role: 'TeamMember' | 'Manager';
  expiresAt: string;
}

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/Auth/login', data);
  return response.data;
};

export const registerApi = async (data: RegisterRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/Auth/register', data);
  return response.data;
};