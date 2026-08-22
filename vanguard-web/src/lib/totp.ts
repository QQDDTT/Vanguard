/**
 * Vanguard FBE Platform - TOTP (Google Authenticator) & 2FA 安全认证核心
 * 遵循 RFC 6238 标准协议与 Web Crypto API 规范
 */

// 默认 2FA Secret (Base32 编码) 与服务标识
export const DEFAULT_TOTP_SECRET = "XTNCZWVQ5HLNZU7BREJITEBT3MK2IPG3";
export const DEFAULT_ACCOUNT = "evotensor:vanguard";
export const DEFAULT_ISSUER = "evotensor";

// 默认管理员密码的 SHA-256 哈希值 (预设初始密码: vanguard2026!)
// 也支持在 localStorage 中由管理员自定义更新
const DEFAULT_PASSWORD_HASH = "b4f2c9fa5f83863484f938d61dd2ffb1049ad5fcfdcbaea4c885cfbe2e7a1ce2"; // sha256("vanguard2026!")

const STORAGE_SESSION_KEY = "vanguard_2fa_session";
const STORAGE_LOCK_KEY = "vanguard_auth_lock";
const STORAGE_ATTEMPTS_KEY = "vanguard_auth_attempts";

const MAX_FAILURES = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 失败超限封禁 15 分钟

export interface SessionInfo {
  token: string;
  username: string;
  authenticatedAt: number;
  expiresAt: number;
  is2FA: boolean;
}

export interface LockoutInfo {
  locked: boolean;
  remainingSeconds: number;
}

/**
 * Base32 字符串转 Uint8Array
 */
export function base32ToUint8Array(base32: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleanBase32 = base32.toUpperCase().replace(/=+$/, "").replace(/[\s-]/g, "");
  
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < cleanBase32.length; i++) {
    const idx = alphabet.indexOf(cleanBase32[i]);
    if (idx === -1) {
      continue;
    }
    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

/**
 * 计算给定时间步长下的 RFC 6238 TOTP 6 位动态验证码
 */
export async function generateTOTPCode(secret: string, timeStepOffset = 0): Promise<string> {
  try {
    const keyData = base32ToUint8Array(secret);
    if (keyData.length === 0) return "";

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyData.buffer as ArrayBuffer,
      { name: "HMAC", hash: { name: "SHA-1" } },
      false,
      ["sign"]
    );

    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / 30) + timeStepOffset;

    // 8 字节大端序缓冲区
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setBigUint64(0, BigInt(counter), false);

    const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);
    const hmacBytes = new Uint8Array(signature);

    // 动态截断 (Dynamic Truncation)
    const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;
    const binary =
      ((hmacBytes[offset] & 0x7f) << 24) |
      ((hmacBytes[offset + 1] & 0xff) << 16) |
      ((hmacBytes[offset + 2] & 0xff) << 8) |
      (hmacBytes[offset + 3] & 0xff);

    const otp = (binary % 1_000_000).toString().padStart(6, "0");
    return otp;
  } catch (err) {
    console.error("TOTP 计算失败:", err);
    return "";
  }
}

/**
 * 校验用户输入的 6 位 TOTP 动态码 (支持 ±1 时间步长漂移容错)
 */
export async function verifyTOTPCode(secret: string, userCode: string): Promise<boolean> {
  const cleanCode = userCode.trim();
  if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
    return false;
  }

  // 校验当前时间片以及前后各一个时间步长 (±30s)
  const steps = [0, -1, 1];
  for (const step of steps) {
    const validCode = await generateTOTPCode(secret, step);
    if (validCode === cleanCode) {
      return true;
    }
  }

  return false;
}

/**
 * SHA-256 哈希计算
 */
export async function sha256(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 校验主密码
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const hash = await sha256(password);
  const customHash = localStorage.getItem("vanguard_custom_pwd_hash");
  if (customHash) {
    return hash === customHash;
  }
  return hash === DEFAULT_PASSWORD_HASH;
}

/**
 * 检查当前是否处于暴力破解锁定状态
 */
export function checkLockout(): LockoutInfo {
  const lockTime = localStorage.getItem(STORAGE_LOCK_KEY);
  if (!lockTime) {
    return { locked: false, remainingSeconds: 0 };
  }

  const unlockAt = parseInt(lockTime, 10);
  const now = Date.now();
  if (now < unlockAt) {
    const remaining = Math.ceil((unlockAt - now) / 1000);
    return { locked: true, remainingSeconds: remaining };
  } else {
    // 锁定已解除，重置状态
    localStorage.removeItem(STORAGE_LOCK_KEY);
    localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
    return { locked: false, remainingSeconds: 0 };
  }
}

/**
 * 记录登录失败次数，超限则触发锁定
 */
export function recordLoginFailure(): { locked: boolean; remainingAttempts: number; remainingSeconds: number } {
  let attempts = parseInt(localStorage.getItem(STORAGE_ATTEMPTS_KEY) || "0", 10);
  attempts += 1;
  localStorage.setItem(STORAGE_ATTEMPTS_KEY, attempts.toString());

  if (attempts >= MAX_FAILURES) {
    const unlockAt = Date.now() + LOCKOUT_DURATION_MS;
    localStorage.setItem(STORAGE_LOCK_KEY, unlockAt.toString());
    return { locked: true, remainingAttempts: 0, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
  }

  return { locked: false, remainingAttempts: MAX_FAILURES - attempts, remainingSeconds: 0 };
}

/**
 * 重置登录失败计数
 */
export function resetLoginFailures(): void {
  localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
  localStorage.removeItem(STORAGE_LOCK_KEY);
}

/**
 * 创建 2FA 认证 Session
 */
export function createSession(username = "admin"): SessionInfo {
  const now = Date.now();
  const session: SessionInfo = {
    token: `vanguard_sess_${Math.random().toString(36).substring(2)}_${now}`,
    username,
    authenticatedAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 天有效期
    is2FA: true,
  };
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  resetLoginFailures();
  return session;
}

/**
 * 读取并校验现有 Session
 */
export function getValidSession(): SessionInfo | null {
  const raw = localStorage.getItem(STORAGE_SESSION_KEY);
  if (!raw) return null;

  try {
    const session: SessionInfo = JSON.parse(raw);
    if (!session.token || !session.expiresAt || Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
}

/**
 * 清除 Session 注销登录
 */
export function clearSession(): void {
  localStorage.removeItem(STORAGE_SESSION_KEY);
}

/**
 * 生成 TOTP 绑定链接 (标准 otpauth 协议)
 */
export function getTOTPUri(account = DEFAULT_ACCOUNT, secret = DEFAULT_TOTP_SECRET, issuer = DEFAULT_ISSUER): string {
  return `otpauth://totp/${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
}
