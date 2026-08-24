/**
 * Vanguard FBE Platform - Auth configuration
 * Delegate to global Security-Server
 */

// 统一 Security-Server 认证中心配置
export const SECURITY_SERVER_URL = "http://34.27.205.225:9000";
export const APP_ID = "app_vanguard";

export interface SessionInfo {
  token: string;
  username: string;
  authenticatedAt: number;
  expiresAt: number;
  is2FA: boolean;
}

export function getValidSession(): SessionInfo | null {
  // If Forward-Auth is correctly set up, local session state is less critical,
  // but we can preserve the interface if the app uses it for UI state.
  return null;
}

export function clearSession(): void {
  // handled by Security Server redirect
}
