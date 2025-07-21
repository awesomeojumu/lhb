import { useEffect, useState } from "react";
import { register, login } from "@services/authService";
import { getProfile } from "@services/userService";
import { getMyKPIs } from "@services/kpiService";
import { fetchNotifications } from "@services/notificationService";
import { saveToken, getToken } from "@utils/storage";

export default function TestApi() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function runHandshakeTests() {
      const logs = [];
      const testUser = {
        firstName: "Lhb",
        lastName: "TesterTwo",
        email: "lhbtester002@gmail.com", // ✅ New unique email
        password: "LhbTest@123",
      };

      try {
        // ✅ 0. Clear any old token before test
        saveToken("");
        logs.push("🔄 Cleared old token from storage");

        // ✅ 1. REGISTER USER
        logs.push("🔄 Registering NEW test user...");
        const registerRes = await register(testUser);
        console.log("DEBUG >> Register Response:", registerRes);
        logs.push(`✅ Registered: ${registerRes.email} (${registerRes.role})`);

        // ✅ 2. LOGIN & SAVE TOKEN
        logs.push("🔄 Logging in with new user...");
        const loginRes = await login(testUser.email, testUser.password);
        console.log("DEBUG >> Login Response:", loginRes);
        saveToken(loginRes.token);
        logs.push(`✅ Login successful: ${loginRes.firstName} (${loginRes.role})`);
        logs.push(`🔄 Token saved: ${loginRes.token}`);
        console.log("DEBUG >> Saved Token:", getToken());

        // ✅ 3. PROFILE
        logs.push("🔄 Fetching profile...");
        const profile = await getProfile();
        console.log("DEBUG >> Profile Response:", profile);
        logs.push(`✅ Profile: ${profile.firstName} ${profile.lastName}`);

        // ✅ 4. MY KPIs
        logs.push("🔄 Fetching My KPIs...");
        const kpis = await getMyKPIs();
        console.log("DEBUG >> KPIs Response:", kpis);
        logs.push(`✅ KPIs fetched: ${kpis.length} found`);

        // ✅ 5. NOTIFICATIONS
        logs.push("🔄 Fetching Notifications...");
        const notifications = await fetchNotifications();
        console.log("DEBUG >> Notifications Response:", notifications);
        logs.push(`✅ Notifications fetched: ${notifications.length} found`);

        logs.push("🎉 HANDSHAKE SUCCESSFUL – All endpoints working fine!");
      } catch (err) {
        console.error("❌ DEBUG >> Handshake Test Fatal Error:", err);
        logs.push(`❌ FATAL ERROR: ${err.message || "Unknown error"}`);
      }

      setResults(logs);
    }

    runHandshakeTests();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🤝 Handshake Test (NEW USER – TesterTwo)</h2>
      <ul>
        {results.map((log, idx) => (
          <li key={idx}>{log}</li>
        ))}
      </ul>
      <p style={{ marginTop: "10px", color: "gray" }}>
        ✅ Open browser console for full debug logs
      </p>
    </div>
  );
}
