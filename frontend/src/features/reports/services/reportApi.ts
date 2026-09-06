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
  projectName?: string | null;
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

// Module 3 — Manager review types
export interface ManagerReportSummary {
  id: string;
  userId: string;
  userName: string;
  weekStartDate: string;
  weekEndDate: string;
  status: string;
  projectName: string | null;
  submittedAt: string | null;
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

// ---------------- Module 3 — Review & Correction Workflow (Manager only) ----------------

export const getAllReportsForManagerApi = async (filters?: {
  status?: string;
  userId?: string;
  projectId?: string;
  weekStartFrom?: string;
  weekStartTo?: string;
}): Promise<ManagerReportSummary[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.userId) params.append('userId', filters.userId);
  if (filters?.projectId) params.append('projectId', filters.projectId);
  if (filters?.weekStartFrom) params.append('weekStartFrom', filters.weekStartFrom);
  if (filters?.weekStartTo) params.append('weekStartTo', filters.weekStartTo);

  const response = await apiClient.get<ManagerReportSummary[]>(
    `/Reports?${params.toString()}`
  );
  return response.data;
};

export const approveReportApi = async (id: string): Promise<ReportResponse> => {
  const response = await apiClient.post<ReportResponse>(`/Reports/${id}/approve`);
  return response.data;
};

export const requestChangesApi = async (
  id: string,
  comment: string
): Promise<ReportResponse> => {
  const response = await apiClient.post<ReportResponse>(`/Reports/${id}/request-changes`, {
    comment,
  });
  return response.data;
};
