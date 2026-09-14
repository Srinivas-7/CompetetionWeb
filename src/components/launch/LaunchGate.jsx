import React, { useState, useEffect } from 'react';
import { LAUNCH_CONFIG } from '../../utils/constants';
import { ComingSoonPage } from './ComingSoonPage';

/**
 * Checks if the current time has reached or passed the launch timestamp.
 */
function isLaunched(offsetMs = 0) {
  return (Date.now() + offsetMs) >= LAUNCH_CONFIG.LAUNCH_TIMESTAMP;
}

export function LaunchGate({ children }) {
  const [clockOffset, setClockOffset] = useState(0);
  const [launched, setLaunched] = useState(() => isLaunched(0));

  // Sync clock drift against server headers if available (non-blocking)
  useEffect(() => {
    let isMounted = true;

    async function syncNetworkTime() {
      try {
        const startTime = Date.now();
        const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
        const dateHeader = res.headers.get('date');
        if (dateHeader && isMounted) {
          const serverTime = new Date(dateHeader).getTime();
          const latency = (Date.now() - startTime) / 2;
          const estimatedServerNow = serverTime + latency;
          const calculatedOffset = estimatedServerNow - Date.now();
          // Only adjust if offset is noticeably drifted (> 3 seconds)
          if (Math.abs(calculatedOffset) > 3000) {
            setClockOffset(calculatedOffset);
            if (isLaunched(calculatedOffset)) {
              setLaunched(true);
            }
          }
        }
      } catch {
        // Fallback gracefully to local clock if network head fails or offline
      }
    }

    syncNetworkTime();
    return () => {
      isMounted = false;
    };
  }, []);

  // Timer to trigger immediate live transition at exact launch timestamp
  useEffect(() => {
    if (launched) return;

    const checkStatus = () => {
      if (isLaunched(clockOffset)) {
        setLaunched(true);
      }
    };

    // Immediate check
    checkStatus();

    // High frequency interval (every 1s) to guarantee instant transition at 10:00:00 AM IST
    const interval = setInterval(checkStatus, 1000);

    // Also set a precise timeout target
    const msUntilLaunch = LAUNCH_CONFIG.LAUNCH_TIMESTAMP - (Date.now() + clockOffset);
    let timeoutId = null;
    if (msUntilLaunch > 0 && msUntilLaunch < 2147483647) { // Max setTimeout limit is 2^31 - 1 (~24.8 days)
      timeoutId = setTimeout(() => {
        setLaunched(true);
      }, msUntilLaunch);
    }

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [launched, clockOffset]);

  // Before launch: Show only the Coming Soon Page (gating the entire app & routes)
  if (!launched) {
    return <ComingSoonPage />;
  }

  // At/After launch: Render existing application untouched
  return <>{children}</>;
}