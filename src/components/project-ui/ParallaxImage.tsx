/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useEffect, useState } from "react";

import { useLenis } from "lenis/react";

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

const ParallaxImage = ({ src = "", alt = "", speed = 0.3 }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const bounds = useRef<{
    top: number;
    bottom: number;
    height: number;
  }>(null);
  const currentTranslateY = useRef(0);
  const targetTranslateY = useRef(0);
  const rafId = useRef<number>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 900);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const updateBounds = () => {
      if (imageRef.current) {
        const rect = (imageRef.current as any).getBoundingClientRect();
        bounds.current = {
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          height: rect.height,
        };
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    const animate = () => {
      if (imageRef.current && bounds.current) {
        currentTranslateY.current = lerp(
          currentTranslateY.current,
          targetTranslateY.current,
          0.1,
        );

        if (
          Math.abs(currentTranslateY.current - targetTranslateY.current) > 0.01
        ) {
          imageRef.current.style.transform = `translateY(${currentTranslateY.current}px) scale(1.2)`;
        }
      }
      rafId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateBounds);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isDesktop]);

  useLenis(({ scroll }) => {
    if (!isDesktop || !bounds.current) return;

    const windowHeight = window.innerHeight;
    const elementMiddle = bounds.current.top + bounds.current.height / 2;
    const windowMiddle = scroll + windowHeight / 2;
    const distanceFromCenter = windowMiddle - elementMiddle;

    targetTranslateY.current = distanceFromCenter * speed;
  });

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        willChange: isDesktop ? "transform" : "auto",
        transform: isDesktop ? "translateY(0) scale(1.2)" : "none",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default ParallaxImage;
