import { API_BASE_URL } from "../constants/app";
import type { OverviewResponse, LotteryPrize, EmployeeBalance, DrawLotteryResponse, LotteryRecord, LotteryStatistics } from "../types";

export async function fetchOverview(): Promise<OverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/overview`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Overview request failed: ${response.status}`);
  }

  return response.json() as Promise<OverviewResponse>;
}

export async function fetchPrizes(): Promise<{ success: boolean; prizes: LotteryPrize[] }> {
  const response = await fetch(`${API_BASE_URL}/lottery/prizes`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Prizes request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchEmployeeBalance(employeeId: string = "EMP001"): Promise<{ success: boolean; data: EmployeeBalance }> {
  const response = await fetch(`${API_BASE_URL}/lottery/balance?employee_id=${employeeId}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Balance request failed: ${response.status}`);
  }

  return response.json();
}

export async function drawLottery(employeeId: string = "EMP001"): Promise<DrawLotteryResponse> {
  const response = await fetch(`${API_BASE_URL}/lottery/draw`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ employee_id: employeeId }),
  });

  return response.json() as Promise<DrawLotteryResponse>;
}

export async function fetchLotteryRecords(employeeId?: string, limit: number = 20): Promise<{ success: boolean; records: LotteryRecord[]; total: number }> {
  const params = new URLSearchParams();
  if (employeeId) params.set("employee_id", employeeId);
  params.set("limit", limit.toString());

  const response = await fetch(`${API_BASE_URL}/lottery/records?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Records request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchLotteryStats(): Promise<{ success: boolean } & LotteryStatistics> {
  const response = await fetch(`${API_BASE_URL}/lottery/stats`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Stats request failed: ${response.status}`);
  }

  return response.json();
}
