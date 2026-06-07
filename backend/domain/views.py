from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from .services import get_overview, get_prizes, get_employee_balance, draw_lottery, get_lottery_records, get_lottery_statistics

def health(_request):
    return JsonResponse({"status": "ok"})

def overview(_request):
    return JsonResponse(get_overview())

@require_http_methods(["GET"])
def lottery_prizes(_request):
    prizes = get_prizes()
    return JsonResponse({"success": True, "prizes": prizes})

@require_http_methods(["GET"])
def employee_balance(request):
    employee_id = request.GET.get("employee_id", "EMP001")
    result = get_employee_balance(employee_id)
    if result is None:
        return JsonResponse({"success": False, "message": "员工信息不存在"}, status=404)
    return JsonResponse({"success": True, "data": result})

@require_http_methods(["POST"])
def lottery_draw(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        body = {}
    employee_id = body.get("employee_id", "EMP001")
    result = draw_lottery(employee_id)
    if not result["success"]:
        return JsonResponse(result, status=400)
    return JsonResponse(result)

@require_http_methods(["GET"])
def lottery_records_list(request):
    employee_id = request.GET.get("employee_id")
    limit = int(request.GET.get("limit", "20"))
    result = get_lottery_records(employee_id, limit)
    return JsonResponse({"success": True, **result})

@require_http_methods(["GET"])
def lottery_stats(_request):
    result = get_lottery_statistics()
    return JsonResponse({"success": True, **result})
