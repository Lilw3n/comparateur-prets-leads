import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Générer un ID de session unique
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('visit_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visit_session_id', sessionId);
  }
  return sessionId;
};

// Détecter le type d'appareil
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Détecter le navigateur
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('Safari') > -1) return 'Safari';
  if (ua.indexOf('Edge') > -1) return 'Edge';
  if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
  return 'Other';
};

// Détecter l'OS
const getOS = (): string => {
  const ua = navigator.userAgent;
  if (ua.indexOf('Windows') > -1) return 'Windows';
  if (ua.indexOf('Mac') > -1) return 'macOS';
  if (ua.indexOf('Linux') > -1) return 'Linux';
  if (ua.indexOf('Android') > -1) return 'Android';
  if (ua.indexOf('iOS') > -1 || /iPad|iPhone|iPod/.test(ua)) return 'iOS';
  return 'Other';
};

export const useVisitTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const sessionId = getSessionId();
        const page = location.pathname + location.search;
        const referrer = document.referrer || undefined;
        const userAgent = navigator.userAgent;
        const deviceType = getDeviceType();
        const browser = getBrowser();
        const os = getOS();

        await axios.post('/api/visits', {
          sessionId,
          page,
          referrer,
          userAgent,
          deviceType,
          browser,
          os
        });
      } catch (error) {
        // Silencieux - ne pas perturber l'expérience utilisateur
        console.debug('Visit tracking error:', error);
      }
    };

    // Attendre un peu pour éviter de tracker les rebonds rapides
    const timeoutId = setTimeout(() => {
      trackVisit();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search]);
};
