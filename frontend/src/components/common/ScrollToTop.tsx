import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;

    const scrollToTop = () => {
      const scrollOptions = {
        top: 0,
        left: 0,
        behavior: 'smooth' as const,
      };

      window.scrollTo(scrollOptions);

      const mainContent = document.querySelector('.ant-layout-content');
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    };

    setTimeout(scrollToTop, 0);
  }, [pathname, hash]);

  return null;
}
