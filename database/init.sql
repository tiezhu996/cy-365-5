CREATE TABLE IF NOT EXISTS operation_records (
  id SERIAL PRIMARY KEY,
  module_name VARCHAR(120) NOT NULL,
  owner_name VARCHAR(80) NOT NULL,
  status VARCHAR(40) NOT NULL,
  metric VARCHAR(40) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO operation_records (module_name, owner_name, status, metric)
VALUES ('积分发放规则配置', '运营组', 'ready', '100%');

CREATE TABLE IF NOT EXISTS lottery_prizes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(255),
  prize_type VARCHAR(20) NOT NULL DEFAULT 'points',
  prize_value INTEGER DEFAULT 0,
  probability INTEGER NOT NULL DEFAULT 0,
  icon VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO lottery_prizes (name, description, prize_type, prize_value, probability, icon, is_active) VALUES
('一等奖', '1000积分大奖', 'points', 1000, 1, '🎁', TRUE),
('二等奖', '500积分奖励', 'points', 500, 5, '🎯', TRUE),
('三等奖', '200积分奖励', 'points', 200, 10, '🎉', TRUE),
('四等奖', '100积分奖励', 'points', 100, 20, '⭐', TRUE),
('五等奖', '50积分奖励', 'points', 50, 30, '✨', TRUE),
('谢谢参与', '感谢您的参与', 'none', 0, 34, '🍀', TRUE);

CREATE TABLE IF NOT EXISTS employee_points (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  employee_name VARCHAR(80) NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employee_points (employee_id, employee_name, balance) VALUES
('EMP001', '张三', 5000),
('EMP002', '李四', 3200),
('EMP003', '王五', 1800);

CREATE TABLE IF NOT EXISTS lottery_records (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  employee_name VARCHAR(80) NOT NULL,
  prize_id INTEGER NOT NULL,
  prize_name VARCHAR(80) NOT NULL,
  prize_type VARCHAR(20) NOT NULL,
  prize_value INTEGER NOT NULL DEFAULT 0,
  cost_points INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lottery_records_employee ON lottery_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_lottery_records_created ON lottery_records(created_at DESC);
