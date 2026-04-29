import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `🐔 ${title} - Ged_AI Poultry` : '🐔 Ged_AI Poultry';
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useTitle;
