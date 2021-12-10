import { useEffect, useRef, useState } from 'react';

const useScroll = () => {
  const [visible, setVisible] = useState(false);
  const elementRef = useRef(null);

  const toggleVisible = () => {
    const scrolled = elementRef.current.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    elementRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.addEventListener('scroll', toggleVisible);
    }
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('scroll', toggleVisible);
      }
    };
  }, []);

  return { visible, elementRef, scrollToTop };
};

export default useScroll;
