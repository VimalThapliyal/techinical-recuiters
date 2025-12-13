"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedStatProps {
  value: string;
  label: string;
  delay?: number;
}

export function AnimatedStat({ value, label, delay = 0 }: AnimatedStatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      const numValue = parseInt(value.replace(/\D/g, ""));
      if (isNaN(numValue)) {
        setCount(0);
        return;
      }

      const duration = 2000;
      const steps = 60;
      const increment = numValue / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= numValue) {
          setCount(numValue);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }, delay);

    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-[#e7f3f8] bg-clip-text text-transparent mb-2">
        {value.includes("+") ? `${count}+` : value}
      </div>
      <div className="text-sm md:text-base text-white/80 font-medium">
        {label}
      </div>
    </div>
  );
}
