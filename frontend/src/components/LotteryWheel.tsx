import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { fetchPrizes, fetchEmployeeBalance, drawLottery, fetchLotteryRecords } from "../api/client";
import { APP_THEME } from "../constants/app";
import type { LotteryPrize, LotteryRecord, DrawLotteryResponse } from "../types";

const WHEEL_COLORS = [
  APP_THEME.accent,
  APP_THEME.warm,
  APP_THEME.surface,
  "#9b87c9",
  "#d4a66c",
  "#b8aad6",
];

const EMPLOYEE_ID = "EMP001";

interface LotteryWheelProps {
  onBack?: () => void;
}

export function LotteryWheel({ onBack }: LotteryWheelProps) {
  const [prizes, setPrizes] = useState<LotteryPrize[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [lotteryCost, setLotteryCost] = useState<number>(100);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [records, setRecords] = useState<LotteryRecord[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<DrawLotteryResponse | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [prizesRes, balanceRes, recordsRes] = await Promise.all([
        fetchPrizes(),
        fetchEmployeeBalance(EMPLOYEE_ID),
        fetchLotteryRecords(EMPLOYEE_ID, 10),
      ]);

      if (prizesRes.success) setPrizes(prizesRes.prizes);
      if (balanceRes.success) {
        setBalance(balanceRes.data.balance);
        setLotteryCost(balanceRes.data.lottery_cost);
        setEmployeeName(balanceRes.data.employee_name);
      }
      if (recordsRes.success) setRecords(recordsRes.records);
    } catch (err) {
      setError("加载数据失败，请稍后重试");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDraw = async () => {
    if (isSpinning) return;
    if (balance < lotteryCost) {
      setError("积分不足，无法参与抽奖");
      return;
    }

    setIsSpinning(true);
    setError(null);

    try {
      const result = await drawLottery(EMPLOYEE_ID);
      setResult(result);

      if (result.success && result.prize) {
        const prizeIndex = result.prize.index;
        const segmentAngle = 360 / prizes.length;
        const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
        const extraSpins = 5 + Math.floor(Math.random() * 3);
        const finalRotation = rotation + extraSpins * 360 + targetAngle;

        setRotation(finalRotation);

        setTimeout(() => {
          setIsSpinning(false);
          setShowResult(true);
          if (result.balance !== undefined) setBalance(result.balance);
          if (result.record) setRecords((prev) => [result.record!, ...prev]);
        }, 4000);
      } else {
        setIsSpinning(false);
        setError(result.message || "抽奖失败");
      }
    } catch (err) {
      setIsSpinning(false);
      setError("抽奖失败，请稍后重试");
      console.error(err);
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setResult(null);
  };

  const getWheelGradient = () => {
    if (prizes.length === 0) return `conic-gradient(${APP_THEME.accent} 0deg 360deg)`;

    const segmentAngle = 360 / prizes.length;
    const parts: string[] = [];

    prizes.forEach((_, index) => {
      const color = WHEEL_COLORS[index % WHEEL_COLORS.length];
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      parts.push(`${color} ${startAngle}deg ${endAngle}deg`);
    });

    return `conic-gradient(${parts.join(", ")})`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: APP_THEME.accent }} />
      </Box>
    );
  }

  return (
    <Box>
      {onBack && (
        <Button
          onClick={onBack}
          sx={{ mb: 2, color: APP_THEME.accent }}
        >
          ← 返回首页
        </Button>
      )}

      <Paper className="work-panel" sx={{ p: 4, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 800 }}>
              🎡 积分抽奖转盘
            </Typography>
            <Typography variant="body1" sx={{ color: "#1f1830", opacity: 0.7 }}>
              每次抽奖消耗 {lotteryCost} 积分，赢取丰厚奖励！
            </Typography>
          </Box>
          <Box textAlign="right">
            <Chip
              label={`当前员工：${employeeName}`}
              sx={{
                background: `color-mix(in srgb, ${APP_THEME.accent} 14%, transparent)`,
                color: APP_THEME.ink,
                fontWeight: 700,
                mb: 1,
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, color: APP_THEME.accent }}>
              积分余额：{balance.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
          alignItems="center"
          justifyContent="center"
        >
          <Box position="relative" width={340} height={340} flexShrink={0}>
            <Box
              sx={{
                position: "absolute",
                top: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: `24px solid ${APP_THEME.warm}`,
                zIndex: 10,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            />

            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: getWheelGradient(),
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning
                  ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                  : "none",
                boxShadow: `0 8px 32px color-mix(in srgb, ${APP_THEME.accent} 30%, transparent)`,
                position: "relative",
                border: `6px solid ${APP_THEME.surface}`,
              }}
            >
              {prizes.map((prize, index) => {
                const angle = (index * 360) / prizes.length + 360 / prizes.length / 2;
                const textColor =
                  WHEEL_COLORS[index % WHEEL_COLORS.length] === APP_THEME.surface
                    ? APP_THEME.ink
                    : "#fff";
                return (
                  <Box
                    key={prize.id}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${angle}deg) translateY(-120px) rotate(-${angle}deg)`,
                      textAlign: "center",
                      width: 80,
                      color: textColor,
                      fontWeight: 700,
                      fontSize: "13px",
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      pointerEvents: "none",
                    }}
                  >
                    <Box sx={{ fontSize: "24px", mb: 0.5 }}>{prize.icon}</Box>
                    <Box>{prize.name}</Box>
                    {prize.prize_value > 0 && (
                      <Box sx={{ fontSize: "11px", opacity: 0.9 }}>
                        +{prize.prize_value}积分
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>

            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${APP_THEME.accent}, #8b70c9)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: "14px",
                boxShadow: `0 4px 16px color-mix(in srgb, ${APP_THEME.accent} 50%, transparent)`,
                border: `4px solid ${APP_THEME.surface}`,
                zIndex: 5,
              }}
            >
              {isSpinning ? "抽奖中" : "GO!"}
            </Box>
          </Box>

          <Box flex={1} maxWidth={400}>
            <Paper
              sx={{
                p: 3,
                background: `color-mix(in srgb, ${APP_THEME.accent} 8%, transparent)`,
                border: `1px solid color-mix(in srgb, ${APP_THEME.accent} 20%, transparent)`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                📋 奖项设置
              </Typography>
              {prizes.map((prize, index) => (
                <Box
                  key={prize.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  py={1.5}
                  sx={{
                    borderBottom:
                      index < prizes.length - 1
                        ? `1px dashed color-mix(in srgb, ${APP_THEME.ink} 10%, transparent)`
                        : "none",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{ fontSize: "20px" }}>{prize.icon}</Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{prize.name}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {prize.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`${prize.probability}%`}
                    size="small"
                    sx={{
                      background: WHEEL_COLORS[index % WHEEL_COLORS.length],
                      color:
                        WHEEL_COLORS[index % WHEEL_COLORS.length] === APP_THEME.surface
                          ? APP_THEME.ink
                          : "#fff",
                      fontWeight: 700,
                    }}
                  />
                </Box>
              ))}
            </Paper>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleDraw}
              disabled={isSpinning || balance < lotteryCost}
              sx={{
                mt: 3,
                py: 2,
                background: `linear-gradient(135deg, ${APP_THEME.accent}, #8b70c9)`,
                fontWeight: 800,
                fontSize: "16px",
                borderRadius: "12px",
                boxShadow: `0 6px 20px color-mix(in srgb, ${APP_THEME.accent} 40%, transparent)`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 24px color-mix(in srgb, ${APP_THEME.accent} 50%, transparent)`,
                },
                "&:disabled": {
                  background: "#ccc",
                  boxShadow: "none",
                },
              }}
            >
              {isSpinning ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                  抽奖进行中...
                </Box>
              ) : balance < lotteryCost ? (
                "积分不足"
              ) : (
                `开始抽奖（消耗 ${lotteryCost} 积分）`
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper className="work-panel" sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          📜 我的抽奖记录
        </Typography>
        {records.length === 0 ? (
          <Box textAlign="center" py={6} sx={{ opacity: 0.5 }}>
            <Typography variant="h6">暂无抽奖记录</Typography>
            <Typography>快来参与抽奖吧！</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              maxHeight: 400,
              overflowY: "auto",
              pr: 1,
            }}
          >
            {records.map((record) => (
              <Paper
                key={record.id}
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background:
                    record.prize_type === "none"
                      ? "transparent"
                      : `color-mix(in srgb, ${APP_THEME.warm} 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${APP_THEME.ink} 10%, transparent)`,
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ fontSize: "28px" }}>{record.icon}</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      {record.prize_name}
                      {record.prize_value > 0 && (
                        <span style={{ color: APP_THEME.warm, marginLeft: 8 }}>
                          +{record.prize_value} 积分
                        </span>
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {record.created_at}
                    </Typography>
                  </Box>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    消耗 {record.cost_points} 积分
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      <Dialog
        open={showResult}
        onClose={handleCloseResult}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: APP_THEME.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            background: `linear-gradient(135deg, ${APP_THEME.accent}, ${APP_THEME.warm})`,
            color: "#fff",
            fontWeight: 800,
            fontSize: "20px",
          }}
        >
          🎉 抽奖结果
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          {result?.prize && (
            <>
              <Box sx={{ fontSize: "80px", mb: 2 }}>{result.prize.icon}</Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: APP_THEME.accent, mb: 2 }}>
                {result.prize.name}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, mb: 3 }}>
                {result.prize.description}
              </Typography>
              {result.prize.prize_value > 0 && (
                <Chip
                  label={`恭喜获得 ${result.prize.prize_value} 积分！`}
                  sx={{
                    background: `color-mix(in srgb, ${APP_THEME.warm} 20%, transparent)`,
                    color: APP_THEME.warm,
                    fontWeight: 800,
                    fontSize: "16px",
                    py: 2,
                    px: 3,
                  }}
                />
              )}
              <Box mt={3} pt={3} borderTop={`1px dashed color-mix(in srgb, ${APP_THEME.ink} 20%, transparent)`}>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  本次抽奖消耗 {lotteryCost} 积分
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                  当前积分余额：{balance.toLocaleString()} 积分
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={handleCloseResult}
            variant="contained"
            sx={{
              background: APP_THEME.accent,
              fontWeight: 700,
              px: 6,
              py: 1.5,
              borderRadius: "8px",
            }}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
