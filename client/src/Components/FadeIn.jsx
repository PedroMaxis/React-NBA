import React, { useEffect, useRef, useState } from 'react';
import '../styles.css';

const FadeInSection = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });

    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100 blur-0 translate-x-0' : 'opacity-0 blur-xl -translate-x-full'}`}    >
      {children}
    </div>
  );
};

export default FadeInSection