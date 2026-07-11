'use client';

import { useEffect } from 'react';

/**
 * Locks `<body>` scroll while `locked` is true, preserving scroll position
 * so the page doesn't jump when the modal/sheet closes. Safe to call from
 * multiple mounted instances — each restores only what it changed.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const scrollY = window.scrollY;
    const originalPosition = body.style.position;
    const originalTop = body.style.top;
    const originalWidth = body.style.width;
    const originalOverflow = body.style.overflow;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = originalPosition;
      body.style.top = originalTop;
      body.style.width = originalWidth;
      body.style.overflow = originalOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
