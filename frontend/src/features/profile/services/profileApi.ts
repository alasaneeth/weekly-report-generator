import apiClient from '../../../api/apiClient';

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  dateOfBirth: string | null;
  mobile: string | null;
}

export interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  mobile?: string | null;
}

export const getMyProfileApi = async (): Promise<Profile> => {
  const response = await apiClient.get<Profile>('/Profile');
  return response.data;
};

export const updateProfileApi = async (data: UpdateProfileInput): Promise<Profile> => {
  const response = await apiClient.put<Profile>('/Profile', data);
  return response.data;
};
