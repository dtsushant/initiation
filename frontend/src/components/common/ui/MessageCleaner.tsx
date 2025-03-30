import { message } from 'antd';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const MessageCleaner = () => {
  const location = useLocation();

  useEffect(() => {
    // Destroy all message notifications when location changes
    return () => {
      message.destroy();
      // toast.dismiss();
    };
  }, [location.pathname]);

  return null;
};
