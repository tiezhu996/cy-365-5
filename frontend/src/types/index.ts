export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  status: string;
  metric: string;
}

export interface KpiItem {
  label: string;
  value: string;
  trend: string;
  tone: string;
}

export interface OperationRecord {
  key: string;
  name: string;
  owner: string;
  status: string;
  metric: string;
  priority: string;
}

export interface OverviewResponse {
  appName: string;
  appCode: string;
  description: string;
  features: FeatureItem[];
  kpis: KpiItem[];
  records: OperationRecord[];
}

export interface LotteryPrize {
  id: number;
  name: string;
  description: string;
  prize_type: string;
  prize_value: number;
  probability: number;
  icon: string;
  is_active: boolean;
}

export interface EmployeeBalance {
  employee_id: string;
  employee_name: string;
  balance: number;
  lottery_cost: number;
}

export interface LotteryRecord {
  id: number;
  employee_id: string;
  employee_name: string;
  prize_id: number;
  prize_name: string;
  prize_type: string;
  prize_value: number;
  cost_points: number;
  description: string;
  icon: string;
  created_at: string;
}

export interface DrawLotteryResponse {
  success: boolean;
  message?: string;
  prize?: {
    id: number;
    name: string;
    description: string;
    prize_type: string;
    prize_value: number;
    icon: string;
    index: number;
  };
  balance?: number;
  cost_points?: number;
  record?: LotteryRecord;
}

export interface LotteryStatistics {
  total_draws: number;
  total_cost: number;
  total_won: number;
  prize_distribution: Record<string, number>;
  lottery_cost: number;
}
