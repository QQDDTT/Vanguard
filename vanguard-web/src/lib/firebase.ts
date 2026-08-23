import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { connectorConfig } from "./dataconnect";

const firebaseConfig = {
  projectId: "vanguard-fbe",
  appId: "1:123456789:web:123456",
  apiKey: "dummy-key-for-emulator",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// 仅在真实配置或本地有 emulator 时静默尝试
if (isLocalhost && firebaseConfig.apiKey !== "dummy-key-for-emulator") {
  signInAnonymously(auth).catch(() => {});
}

const dataConnect = getDataConnect(app, connectorConfig);

// 仅在本地开发态连接 Data Connect emulator
if (isLocalhost) {
  try {
    connectDataConnectEmulator(dataConnect, "127.0.0.1", 9399);
  } catch {
    // 静默忽略
  }
}

export { app, auth, dataConnect };
