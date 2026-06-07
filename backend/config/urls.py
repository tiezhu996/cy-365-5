from django.urls import path
from domain.views import (
    health, overview,
    lottery_prizes, employee_balance, lottery_draw,
    lottery_records_list, lottery_stats
)

urlpatterns = [
    path("health", health),
    path("api/health", health),
    path("overview", overview),
    path("api/overview", overview),
    path("api/lottery/prizes", lottery_prizes),
    path("api/lottery/balance", employee_balance),
    path("api/lottery/draw", lottery_draw),
    path("api/lottery/records", lottery_records_list),
    path("api/lottery/stats", lottery_stats),
]
