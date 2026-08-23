import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  QrCode,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  Zap,
  RotateCcw,
} from "lucide-react";
import {
  DEFAULT_ACCOUNT,
  DEFAULT_TOTP_SECRET,
  checkLockout,
  clearSession,
  createSession,
  generateTOTPCodeSync,
  getValidSession,
  recordLoginFailure,
  resetLockout,
  verifyPassword,
  verifyTOTPCode,
} from "../lib/totp";
import type { SessionInfo } from "../lib/totp";

interface AuthGuardProps {
  children: (props: { session: SessionInfo; logout: () => void }) => React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBindModal, setShowBindModal] = useState(false);
  const [copied, setCopied] = useState(false);
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

    if (!password) {
      setErrorMessage("请输入管理员密码");
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
      // 1. 验证主密码
      const isPwdValid = await verifyPassword(password);
      if (!isPwdValid) {
        const failure = recordLoginFailure();
        if (failure.locked) {
          setLockoutRemaining(failure.remainingSeconds);
          setErrorMessage(`连续错误次数超限！已触发安全锁定 15 分钟`);
        } else {
          setErrorMessage(`管理员密码错误，剩余尝试次数: ${failure.remainingAttempts}`);
        }
        setIsLoading(false);
        return;
      }

      // 2. 验证 TOTP 动态验证码 (支持 ±30s 时间漂移)
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
      const newSession = createSession("admin");
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

  const handleCopySecret = () => {
    navigator.clipboard.writeText(DEFAULT_TOTP_SECRET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickFill = () => {
    if (!password) {
      setPassword("vanguard2026!");
    }
    const currentCode = generateTOTPCodeSync(DEFAULT_TOTP_SECRET);
    setTotpCode(currentCode);
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
          <div className="auth-logo-badge">
            <ShieldCheck size={36} color="var(--color-accent)" />
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
            <label className="auth-label">
              <Lock size={15} />
              管理员密码
            </label>
            <input
              type="password"
              className="auth-input"
              placeholder="请输入管理员密码 (默认: vanguard2026!)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isLocked}
              autoComplete="current-password"
            />
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label">
                <KeyRound size={15} />
                Google Authenticator 动态码 (2FA)
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={handleQuickFill}
                  style={{ color: "#38bdf8", display: "flex", alignItems: "center", gap: "3px", fontWeight: 600 }}
                  title="自动计算并填入当前时间片的有效 6 位 TOTP 动态码"
                >
                  <Zap size={13} />
                  一键填入实时码
                </button>
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => setShowBindModal(true)}
                >
                  <QrCode size={14} />
                  查看密钥
                </button>
              </div>
            </div>
            <input
              type="text"
              className="auth-input totp-input"
              placeholder="6 位动态验证码 (如 123456 或点击上方一键填入)"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
              disabled={isLoading || isLocked}
              autoComplete="one-time-code"
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

      {/* 首次绑定 / 2FA 密钥查看浮窗 */}
      {showBindModal && (
        <div className="auth-modal-overlay" onClick={() => setShowBindModal(false)}>
          <div
            className="glass-panel auth-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <QrCode size={22} color="var(--color-accent)" />
                <h3>绑定 Google Authenticator</h3>
              </div>
              <button
                className="auth-close-btn"
                onClick={() => setShowBindModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="auth-modal-body">
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                请打开手机上的 <strong>Google Authenticator</strong>、<strong>1Password</strong> 或{" "}
                <strong>Microsoft Authenticator</strong>，选择【添加账户】并在【手动输入密钥】中填写以下信息：
              </p>

              <div className="auth-secret-box">
                <div className="auth-secret-row">
                  <span className="auth-secret-label">账号名称:</span>
                  <span className="auth-secret-val">{DEFAULT_ACCOUNT}</span>
                </div>
                <div className="auth-secret-row">
                  <span className="auth-secret-label">服务标识 (Issuer):</span>
                  <span className="auth-secret-val">evotensor</span>
                </div>
                <div className="auth-secret-row">
                  <span className="auth-secret-label">2FA 密钥 (Secret):</span>
                  <code className="auth-secret-code">{DEFAULT_TOTP_SECRET}</code>
                </div>
                <div className="auth-secret-row" style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                  <span className="auth-secret-label" style={{ color: "var(--color-accent)" }}>当前实时验证码:</span>
                  <strong style={{ fontSize: "1.2rem", letterSpacing: "2px", color: "var(--color-accent)" }}>
                    {generateTOTPCodeSync(DEFAULT_TOTP_SECRET)}
                  </strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="auth-copy-btn"
                  onClick={() => {
                    setTotpCode(generateTOTPCodeSync(DEFAULT_TOTP_SECRET));
                    setShowBindModal(false);
                    setErrorMessage("");
                  }}
                  style={{ background: "rgba(59, 130, 246, 0.2)", borderColor: "var(--color-accent)" }}
                >
                  ⚡ 一键填入当前验证码
                </button>
                <button
                  type="button"
                  className="auth-copy-btn"
                  onClick={handleCopySecret}
                >
                  {copied ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
                  {copied ? "已复制密钥" : "复制 2FA Secret 密钥"}
                </button>
              </div>
            </div>

            <div className="auth-modal-footer">
              <button
                type="button"
                className="primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setShowBindModal(false)}
              >
                我已完成绑定，返回登录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
