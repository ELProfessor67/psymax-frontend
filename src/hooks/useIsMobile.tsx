import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(window?.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window?.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
