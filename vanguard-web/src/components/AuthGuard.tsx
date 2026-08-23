import { useState, useEffect } from "react";
import { VanguardLogo } from './VanguardLogo';
import {
  ShieldCheck,
  User,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import {
  DEFAULT_TOTP_SECRET,
  checkLockout,
  clearSession,
  createSession,
  getValidSession,
  recordLoginFailure,
  resetLockout,
  verifyCredentials,
  verifyTOTPCode,
} from "../lib/totp";
import type { SessionInfo } from "../lib/totp";

interface AuthGuardProps {
  children: (props: { session: SessionInfo; logout: () => void }) => React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // 初始化检查现有 Session 和防爆破锁定状态
  useEffect(() => {
    const existing = getValidSession();
    if (existing) {
      setSession(existing);
    }

    const lock = checkLockout();
    if (lock.locked) {
      setLockoutRemaining(lock.remainingSeconds);
    }
  }, []);

  // 锁定倒计时定时器
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) {
      setErrorMessage(`系统处于安全锁定保护中，请等待 ${lockoutRemaining} 秒后再试`);
      return;
    }

    const cleanUser = username.trim();
    if (!cleanUser) {
      setErrorMessage("请输入管理员或团队账号");
      return;
    }

    if (!password) {
      setErrorMessage("请输入访问密码");
      return;
    }

    const cleanTotp = totpCode.trim();
    if (!cleanTotp || cleanTotp.length !== 6) {
      setErrorMessage("请输入 Google Authenticator 6 位数字动态验证码");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // 1. 验证账号与主密码
      const isCredsValid = await verifyCredentials(cleanUser, password);
      if (!isCredsValid) {
        const failure = recordLoginFailure();
        if (failure.locked) {
          setLockoutRemaining(failure.remainingSeconds);
          setErrorMessage(`连续错误次数超限！已触发安全锁定 15 分钟`);
        } else {
          setErrorMessage(`账号或密码错误，剩余尝试次数: ${failure.remainingAttempts}`);
        }
        setIsLoading(false);
        return;
      }

      // 2. 验证 TOTP 动态验证码 (支持 ±180s 容错)
      const isTotpValid = await verifyTOTPCode(DEFAULT_TOTP_SECRET, cleanTotp);
      if (!isTotpValid) {
        const failure = recordLoginFailure();
        if (failure.locked) {
          setLockoutRemaining(failure.remainingSeconds);
          setErrorMessage(`连续错误次数超限！已触发安全锁定 15 分钟`);
        } else {
          setErrorMessage(
            `Google Authenticator 动态验证码无效或已过期，请核对手机时间（剩余尝试次数: ${failure.remainingAttempts}）`
          );
        }
        setIsLoading(false);
        return;
      }

      // 3. 校验成功，签发 2FA 会话凭据
      const newSession = createSession(cleanUser);
      setSession(newSession);
      setPassword("");
      setTotpCode("");
    } catch (err) {
      console.error("认证过程异常:", err);
      setErrorMessage("认证服务异常，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setPassword("");
    setTotpCode("");
    setErrorMessage("");
  };

  const handleResetLock = () => {
    resetLockout();
    setLockoutRemaining(0);
    setErrorMessage("");
  };

  // 已登录状态，渲染受保护的主界面与注入退出回调
  if (session) {
    return <>{children({ session, logout: handleLogout })}</>;
  }

  const isLocked = lockoutRemaining > 0;

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge" style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <VanguardLogo size={56} />
          </div>
          <h1 className="auth-title">Vanguard FBE Platform</h1>
          <p className="auth-subtitle">双因素身份鉴权 · 零信任控制台</p>
        </div>

        {errorMessage && (
          <div className="auth-alert error" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
            {isLocked && (
              <button
                type="button"
                onClick={handleResetLock}
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <RotateCcw size={12} />
                解除锁定
              </button>
            )}
          </div>
        )}

        {isLocked && (
          <div className="auth-alert warning" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
              <span>
                防暴力破解锁定保护中，剩余解封时间：<strong>{lockoutRemaining}</strong> 秒
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetLock}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <RotateCcw size={12} />
              立即解锁
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="username">
              <User size={15} />
              管理员 / 团队账号
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="auth-input"
              placeholder="例如: nick / admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading || isLocked}
              autoComplete="username"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              <Lock size={15} />
              访问密码
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="请输入访问密码 (默认: vanguard2026!)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isLocked}
                autoComplete="current-password"
                required
                style={{ paddingRight: "40px", width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  color: "var(--color-text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
                title={showPassword ? "隐藏密码" : "显示密码"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="totp_code">
              <KeyRound size={15} />
              Google Authenticator 动态码 (2FA)
            </label>
            <input
              id="totp_code"
              name="totp_code"
              type="text"
              className="auth-input totp-input"
              placeholder="6 位动态验证码 (如 123456)"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
              disabled={isLoading || isLocked}
              autoComplete="one-time-code"
              inputMode="numeric"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn primary"
            disabled={isLoading || isLocked}
          >
            {isLoading ? (
              <span>验证鉴权中...</span>
            ) : isLocked ? (
              <span>安全锁定中 ({lockoutRemaining}s)</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                安全登录并进入控制台
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-notes">
          <span>🔒 基于 RFC 6238 TOTP 协议与 AES/SHA-256 硬件级加密防护</span>
        </div>
      </div>
    </div>
  );
};
