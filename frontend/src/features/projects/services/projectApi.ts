import apiClient from '../../../api/apiClient';

export interface Project {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface SaveProjectInput {
  name: string;
  description: string;
  isActive: boolean;
}

export const getProjectsApi = async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>('/Projects');
  return response.data;
};

export const createProjectApi = async (data: SaveProjectInput): Promise<Project> => {
  const response = await apiClient.post<Project>('/Projects', data);
  return response.data;
};

export const updateProjectApi = async (
  id: string,
  data: SaveProjectInput
): Promise<Project> => {
  const response = await apiClient.put<Project>(`/Projects/${id}`, data);
  return response.data;
};

export const deleteProjectApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/Projects/${id}`);
};
