"use client";

import { useEffect, useRef, type CSSProperties, type PropsWithChildren } from "react";

type Direction = "up" | "left" | "right";

type RevealProps = PropsWithChildren<{
  className?: string;
  direction?: Direction;
  delay?: number;
  amount?: number;
  ariaLabel?: string;
}>;

function useScrollReveal(amount: number) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }

    element.classList.add("scroll-reveal-ready");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.add("is-visible");
        observer.unobserve(element);
      },
      { threshold: amount, rootMargin: "0px 0px -3% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [amount]);

  return ref;
}

export function ScrollReveal({ children, className = "", direction = "up", delay = 0, amount = 0.18, ariaLabel }: RevealProps) {
  const ref = useScrollReveal(amount);
  const style = { "--reveal-delay": `${delay}s` } as CSSProperties;

  return (
    <div ref={ref} className={`scroll-reveal scroll-from-${direction} ${className}`.trim()} style={style} aria-label={ariaLabel}>
      {children}
    </div>
  );
}

export function ScrollStagger({ children, className = "", amount = 0.14 }: RevealProps) {
  const ref = useScrollReveal(amount);

  return (
    <div ref={ref} className={`scroll-stagger ${className}`.trim()}>
      {children}
    </div>
  );
}

export function ScrollItem({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <div className={`scroll-stagger-item ${className}`.trim()}>{children}</div>;
}

export function ScrollArticle({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <article className={`scroll-stagger-item ${className}`.trim()}>{children}</article>;
}
