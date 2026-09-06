import apiClient from '../../../api/apiClient';

export const changePasswordApi = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await apiClient.post('/Settings/change-password', { currentPassword, newPassword });
};
