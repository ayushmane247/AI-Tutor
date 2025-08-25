import { useState, useCallback } from 'react';

const toasts = [];
let toastId = 0;

export function useToast() {
  const [, forceUpdate] = useState({});

  const toast = useCallback(({ title, description, duration = 5000, variant = 'default' }) => {
    const id = toastId++;
    const newToast = {
      id,
      title,
      description,
      duration,
      variant,
      createdAt: Date.now()
    };

    toasts.push(newToast);
    forceUpdate({});

    // Auto remove after duration
    setTimeout(() => {
      const index = toasts.findIndex(t => t.id === id);
      if (index > -1) {
        toasts.splice(index, 1);
        forceUpdate({});
      }
    }, duration);

    return id;
  }, []);

  const dismiss = useCallback((toastId) => {
    const index = toasts.findIndex(t => t.id === toastId);
    if (index > -1) {
      toasts.splice(index, 1);
      forceUpdate({});
    }
  }, []);

  return {
    toast,
    dismiss,
    toasts: [...toasts]
  };
}
