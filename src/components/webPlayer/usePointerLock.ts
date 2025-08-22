import { useEffect } from 'react';

export function usePointerLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const canvas = document.querySelector('.ps-video') as HTMLElement | null;
    if (!canvas) return;
    const request = () => canvas.requestPointerLock?.();
    canvas.addEventListener('click', request);
    return () => canvas.removeEventListener('click', request);
  }, [active]);
}
