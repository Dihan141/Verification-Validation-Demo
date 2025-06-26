const lastAlertTimes = {}; // { serviceName: timestamp }

const THROTTLE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function shouldSendAlert(serviceName) {
  const now = Date.now();
  const lastTime = lastAlertTimes[serviceName] || 0;

  if (now - lastTime >= THROTTLE_DURATION_MS) {
    lastAlertTimes[serviceName] = now;
    return true;
  }
  return false;
}

module.exports = { shouldSendAlert };
