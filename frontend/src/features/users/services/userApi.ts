import apiClient from '../../../api/apiClient';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getUsersApi = async (): Promise<UserSummary[]> => {
  const response = await apiClient.get<UserSummary[]>('/Users');
  return response.data;
};
