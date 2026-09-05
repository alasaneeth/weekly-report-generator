import apiClient from '../../../api/apiClient';

export interface ReportTaskInput {
  taskName: string;
  priority: 'Low' | 'Medium' | 'High';
  plannedPercentage: number;
  actualPercentage: number;
  status: 'NotStarted' | 'InProgress' | 'Completed' | 'Blocked';
  timePlannedHours: number;
  timeSpentHours: number;
  deliverable?: string;
}

export interface NextWeekTaskInput {
  taskName: string;
  description?: string;
}

export interface BlockerInput {
  description: string;
  isKeyIssue: boolean;
}

export interface AchievementInput {
  description: string;
  isKeyAchievement: boolean;
}

export interface SaveReportInput {
  projectId?: string | null;
  weekStartDate: string;
  weekEndDate: string;
  notes?: string;
  links?: string;
  tasks: ReportTaskInput[];
  nextWeekTasks: NextWeekTaskInput[];
  blockers: BlockerInput[];
  achievements: AchievementInput[];
  hoursByTaskTypes: [];
}

export interface ReportResponse extends SaveReportInput {
  id: string;
  userId: string;
  userName: string;
  status: string;
  managerComment: string | null;
  submittedAt: string | null;
}

export interface ReportSummary {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  status: string;
  projectName: string | null;
}

export const createReportApi = async (data: SaveReportInput): Promise<ReportResponse> => {
  const response = await apiClient.post<ReportResponse>('/Reports', data);
  return response.data;
};

export const updateReportApi = async (
  id: string,
  data: SaveReportInput
): Promise<ReportResponse> => {
  const response = await apiClient.put<ReportResponse>(`/Reports/${id}`, data);
  return response.data;
};

export const submitReportApi = async (id: string): Promise<ReportResponse> => {
  const response = await apiClient.post<ReportResponse>(`/Reports/${id}/submit`);
  return response.data;
};

export const getReportByIdApi = async (id: string): Promise<ReportResponse> => {
  const response = await apiClient.get<ReportResponse>(`/Reports/${id}`);
  return response.data;
};

export const getMyReportHistoryApi = async (): Promise<ReportSummary[]> => {
  const response = await apiClient.get<ReportSummary[]>('/Reports/mine');
  return response.data;
};