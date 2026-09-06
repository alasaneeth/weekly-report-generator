import apiClient from '../../../api/apiClient';

export interface DashboardSummary {
  reportsThisWeek: number;
  complianceRatePercent: number;
  needsCorrectionCount: number;
  openBlockersCount: number;
}

export interface MemberStatus {
  userName: string;
  status: string;
}

export interface ProjectWorkload {
  projectName: string;
  reportCount: number;
}

export interface TaskTypeHours {
  taskType: string;
  hours: number;
}

export interface RecentActivity {
  userName: string;
  status: string;
  timestamp: string;
}

export interface DashboardCharts {
  statusByMember: MemberStatus[];
  workloadByProject: ProjectWorkload[];
  timeByTaskType: TaskTypeHours[];
  recentActivity: RecentActivity[];
}

export const getDashboardSummaryApi = async (): Promise<DashboardSummary> => {
  const response = await apiClient.get<DashboardSummary>('/Dashboard/summary');
  return response.data;
};

export const getDashboardChartsApi = async (): Promise<DashboardCharts> => {
  const response = await apiClient.get<DashboardCharts>('/Dashboard/charts');
  return response.data;
};
