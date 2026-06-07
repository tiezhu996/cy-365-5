import random
from datetime import datetime
from typing import List, Dict, Any, Optional

OVERVIEW = {
  "appName": "企业福利积分商城系统",
  "appCode": "ldwelfaremall",
  "description": "面向企业HR部门，提供员工福利积分发放、积分商城兑换和福利账单管理的一站式平台。",
  "features": [
    {
      "id": 1,
      "title": "积分发放规则配置",
      "description": "HR配置积分获取规则，如考勤全勤、绩效优秀、入职周年、节日福利等，系统自动计算并发放积分到员工账户。",
      "status": "已上线",
      "metric": "88%"
    },
    {
      "id": 2,
      "title": "积分商城商品上架",
      "description": "管理员上架可兑换商品（实物/虚拟卡券/服务），设置所需积分、库存数量和兑换限制（如每人限兑数量）。",
      "status": "排期中",
      "metric": "31 单"
    },
    {
      "id": 3,
      "title": "秒杀与限时兑换",
      "description": "设置限时秒杀活动，指定活动时段和库存，员工在活动期间抢购，先到先得，增强福利趣味性。",
      "status": "巡检中",
      "metric": "10 项"
    },
    {
      "id": 4,
      "title": "积分抽奖转盘",
      "description": "员工消耗积分参与抽奖，配置奖项概率和奖品池（积分/实物/谢谢参与），记录每次抽奖结果和中奖名单。",
      "status": "已上线",
      "metric": "4 级"
    },
    {
      "id": 5,
      "title": "订单发货与福利账单",
      "description": "兑换成功后生成订单，管理员处理发货并更新物流状态，HR可查看月度福利积分支出账单和兑换统计。",
      "status": "可导出",
      "metric": "28 条"
    }
  ],
  "kpis": [
    {
      "label": "今日处理",
      "value": "104",
      "trend": "+12%",
      "tone": "primary"
    },
    {
      "label": "预约/订单",
      "value": "40",
      "trend": "+8%",
      "tone": "warm"
    },
    {
      "label": "履约率",
      "value": "92%",
      "trend": "+3%",
      "tone": "cool"
    },
    {
      "label": "待处理",
      "value": "9",
      "trend": "需跟进",
      "tone": "neutral"
    }
  ],
  "records": [
    {
      "key": "ldwelfaremall-1",
      "name": "积分发放规则配置",
      "owner": "运营组",
      "status": "已上线",
      "metric": "88%",
      "priority": "高"
    },
    {
      "key": "ldwelfaremall-2",
      "name": "积分商城商品上架",
      "owner": "管理员",
      "status": "排期中",
      "metric": "31 单",
      "priority": "中"
    },
    {
      "key": "ldwelfaremall-3",
      "name": "秒杀与限时兑换",
      "owner": "服务台",
      "status": "巡检中",
      "metric": "10 项",
      "priority": "低"
    },
    {
      "key": "ldwelfaremall-4",
      "name": "积分抽奖转盘",
      "owner": "财务组",
      "status": "已上线",
      "metric": "4 级",
      "priority": "高"
    },
    {
      "key": "ldwelfaremall-5",
      "name": "订单发货与福利账单",
      "owner": "审核组",
      "status": "可导出",
      "metric": "28 条",
      "priority": "中"
    }
  ]
}

LOTTERY_COST = 100

PRIZES = [
    {"id": 1, "name": "一等奖", "description": "1000积分大奖", "prize_type": "points", "prize_value": 1000, "probability": 1, "icon": "🎁", "is_active": True},
    {"id": 2, "name": "二等奖", "description": "500积分奖励", "prize_type": "points", "prize_value": 500, "probability": 5, "icon": "🎯", "is_active": True},
    {"id": 3, "name": "三等奖", "description": "200积分奖励", "prize_type": "points", "prize_value": 200, "probability": 10, "icon": "🎉", "is_active": True},
    {"id": 4, "name": "四等奖", "description": "100积分奖励", "prize_type": "points", "prize_value": 100, "probability": 20, "icon": "⭐", "is_active": True},
    {"id": 5, "name": "五等奖", "description": "50积分奖励", "prize_type": "points", "prize_value": 50, "probability": 30, "icon": "✨", "is_active": True},
    {"id": 6, "name": "谢谢参与", "description": "感谢您的参与", "prize_type": "none", "prize_value": 0, "probability": 34, "icon": "🍀", "is_active": True},
]

EMPLOYEES = {
    "EMP001": {"employee_id": "EMP001", "employee_name": "张三", "balance": 5000},
    "EMP002": {"employee_id": "EMP002", "employee_name": "李四", "balance": 3200},
    "EMP003": {"employee_id": "EMP003", "employee_name": "王五", "balance": 1800},
}

lottery_records: List[Dict[str, Any]] = []


def get_overview():
    return OVERVIEW


def get_prizes() -> List[Dict[str, Any]]:
    active_prizes = [p for p in PRIZES if p["is_active"]]
    return active_prizes


def get_employee_info(employee_id: str) -> Optional[Dict[str, Any]]:
    return EMPLOYEES.get(employee_id)


def get_employee_balance(employee_id: str) -> Optional[Dict[str, Any]]:
    emp = EMPLOYEES.get(employee_id)
    if not emp:
        return None
    return {
        "employee_id": emp["employee_id"],
        "employee_name": emp["employee_name"],
        "balance": emp["balance"],
        "lottery_cost": LOTTERY_COST
    }


def draw_lottery(employee_id: str) -> Dict[str, Any]:
    emp = EMPLOYEES.get(employee_id)
    if not emp:
        return {"success": False, "message": "员工信息不存在"}

    if emp["balance"] < LOTTERY_COST:
        return {"success": False, "message": "积分不足，无法参与抽奖"}

    active_prizes = [p for p in PRIZES if p["is_active"]]
    total_prob = sum(p["probability"] for p in active_prizes)

    rand = random.randint(1, total_prob)
    cumulative = 0
    winning_prize = None

    for prize in active_prizes:
        cumulative += prize["probability"]
        if rand <= cumulative:
            winning_prize = prize
            break

    if not winning_prize:
        winning_prize = active_prizes[-1]

    emp["balance"] -= LOTTERY_COST

    if winning_prize["prize_type"] == "points":
        emp["balance"] += winning_prize["prize_value"]

    record = {
        "id": len(lottery_records) + 1,
        "employee_id": employee_id,
        "employee_name": emp["employee_name"],
        "prize_id": winning_prize["id"],
        "prize_name": winning_prize["name"],
        "prize_type": winning_prize["prize_type"],
        "prize_value": winning_prize["prize_value"],
        "cost_points": LOTTERY_COST,
        "description": winning_prize["description"],
        "icon": winning_prize["icon"],
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    lottery_records.insert(0, record)

    return {
        "success": True,
        "prize": {
            "id": winning_prize["id"],
            "name": winning_prize["name"],
            "description": winning_prize["description"],
            "prize_type": winning_prize["prize_type"],
            "prize_value": winning_prize["prize_value"],
            "icon": winning_prize["icon"],
            "index": active_prizes.index(winning_prize)
        },
        "balance": emp["balance"],
        "cost_points": LOTTERY_COST,
        "record": record
    }


def get_lottery_records(employee_id: Optional[str] = None, limit: int = 20) -> Dict[str, Any]:
    records = lottery_records
    if employee_id:
        records = [r for r in records if r["employee_id"] == employee_id]

    return {
        "records": records[:limit],
        "total": len(records)
    }


def get_lottery_statistics() -> Dict[str, Any]:
    prize_counts = {p["name"]: 0 for p in PRIZES if p["is_active"]}
    for record in lottery_records:
        if record["prize_name"] in prize_counts:
            prize_counts[record["prize_name"]] += 1

    total_draws = len(lottery_records)
    total_cost = total_draws * LOTTERY_COST
    total_won = sum(r["prize_value"] for r in lottery_records)

    return {
        "total_draws": total_draws,
        "total_cost": total_cost,
        "total_won": total_won,
        "prize_distribution": prize_counts,
        "lottery_cost": LOTTERY_COST
    }
