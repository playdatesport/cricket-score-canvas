import { useState, useCallback, useEffect } from 'react';

export const usePushNotifications = () => {
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback((title, options = {}) => {
    if (!isSupported || permission !== 'granted') return null;

    try {
      const notification = new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options,
      });

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }, [isSupported, permission]);

  const notifyScoreUpdate = useCallback((teamName, score, wickets, overs) => {
    sendNotification('Score Update', {
      body: `${teamName}: ${score}/${wickets} (${overs} overs)`,
      tag: 'score-update',
      renotify: true,
    });
  }, [sendNotification]);

  const notifyWicket = useCallback((batterName, dismissalType, bowlerName) => {
    sendNotification('Wicket!', {
      body: `${batterName} ${dismissalType} b ${bowlerName}`,
      tag: 'wicket',
      renotify: true,
    });
  }, [sendNotification]);

  const notifyMilestone = useCallback((playerName, milestone) => {
    sendNotification('Milestone!', {
      body: `${playerName} reaches ${milestone}`,
      tag: 'milestone',
      renotify: true,
    });
  }, [sendNotification]);

  const notifyInningsEnd = useCallback((teamName, score, wickets) => {
    sendNotification('Innings Complete', {
      body: `${teamName}: ${score}/${wickets}`,
      tag: 'innings-end',
      renotify: true,
    });
  }, [sendNotification]);

  const notifyMatchResult = useCallback((resultText) => {
    sendNotification('Match Result', {
      body: resultText,
      tag: 'match-result',
      renotify: true,
    });
  }, [sendNotification]);

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    notifyScoreUpdate,
    notifyWicket,
    notifyMilestone,
    notifyInningsEnd,
    notifyMatchResult,
  };
};
