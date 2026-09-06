import apiClient from '../../../api/apiClient';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getMyProfileApi = async (): Promise<Profile> => {
  const response = await apiClient.get<Profile>('/Profile');
  return response.data;
};

export const updateProfileApi = async (name: string): Promise<Profile> => {
  const response = await apiClient.put<Profile>('/Profile', { name });
  return response.data;
};
