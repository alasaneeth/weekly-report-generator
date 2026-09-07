import apiClient from '../../../api/apiClient';

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  dateOfBirth: string | null;
  mobile: string | null;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'TeamMember' | 'Manager';
  dateOfBirth?: string | null;
  mobile?: string | null;
}

export interface UpdateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: 'TeamMember' | 'Manager';
  isActive: boolean;
  dateOfBirth?: string | null;
  mobile?: string | null;
}

export const getUsersApi = async (): Promise<UserSummary[]> => {
  const response = await apiClient.get<UserSummary[]>('/Users');
  return response.data;
};

export const createUserApi = async (data: CreateUserInput): Promise<UserSummary> => {
  const response = await apiClient.post<UserSummary>('/Users', data);
  return response.data;
};

export const updateUserApi = async (
  id: string,
  data: UpdateUserInput
): Promise<UserSummary> => {
  const response = await apiClient.put<UserSummary>(`/Users/${id}`, data);
  return response.data;
};
