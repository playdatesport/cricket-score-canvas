import { useState, useEffect, useCallback } from "react";

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = "Notification" in window && "serviceWorker" in navigator;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch {
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    async ({ title, body, icon = "/pwa-192x192.png", tag, data }: NotificationOptions) => {
      if (!isSupported || permission !== "granted") return null;

      try {
        // Try to use service worker for notifications (works in background)
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body,
          icon,
          tag,
          data,
          badge: "/pwa-192x192.png",
        });
        return true;
      } catch {
        // Fallback to regular notification
        try {
          new Notification(title, { body, icon, tag });
          return true;
        } catch {
          return false;
        }
      }
    },
    [isSupported, permission]
  );

  // Match-specific notification helpers
  const notifyScoreUpdate = useCallback(
    (team: string, runs: number, wickets: number, overs: string) => {
      return sendNotification({
        title: `${team} Score Update`,
        body: `${runs}/${wickets} (${overs} overs)`,
        tag: "score-update",
      });
    },
    [sendNotification]
  );

  const notifyWicket = useCallback(
    (batterName: string, bowlerName: string) => {
      return sendNotification({
        title: "Wicket! 🏏",
        body: `${batterName} dismissed by ${bowlerName}`,
        tag: "wicket",
      });
    },
    [sendNotification]
  );

  const notifyMilestone = useCallback(
    (playerName: string, milestone: string) => {
      return sendNotification({
        title: `${milestone}! 🎉`,
        body: `${playerName} reaches ${milestone}`,
        tag: "milestone",
      });
    },
    [sendNotification]
  );

  const notifyInningsEnd = useCallback(
    (team: string, score: string) => {
      return sendNotification({
        title: "Innings Complete",
        body: `${team} finished at ${score}`,
        tag: "innings-end",
      });
    },
    [sendNotification]
  );

  const notifyMatchResult = useCallback(
    (result: string) => {
      return sendNotification({
        title: "Match Result 🏆",
        body: result,
        tag: "match-result",
      });
    },
    [sendNotification]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    notifyScoreUpdate,
    notifyWicket,
    notifyMilestone,
    notifyInningsEnd,
    notifyMatchResult,
  };
};
