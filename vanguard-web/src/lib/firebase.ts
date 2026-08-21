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

// Use anonymous auth by default to satisfy Data Connect auth constraints locally
signInAnonymously(auth).catch((error) => {
  console.warn("Failed to sign in anonymously:", error);
});

const dataConnect = getDataConnect(app, connectorConfig);

// Connect to local Data Connect emulator
connectDataConnectEmulator(dataConnect, "127.0.0.1", 9399);

export { app, auth, dataConnect };
