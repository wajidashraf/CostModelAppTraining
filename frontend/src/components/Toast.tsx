/**
 * Toast Component
 *
 * Temporary notification message that auto-dismisses.
 * Shows success, error, info, or warning messages.
 *
 * Phase 7 - Commit 3: Toast notification system
 */

import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  /**
   * Message to display
   */
  message: string;

  /**
   * Type of toast (affects styling and icon)
   */
  type: ToastType;

  /**
   * Duration in milliseconds before auto-dismiss (default: 3000)
   */
  duration?: number;

  /**
   * Callback when toast is dismissed
   */
  onClose: () => void;
}

/**
 * Toast - Temporary notification component
 *
 * Features:
 * - Auto-dismiss after duration
 * - Click to dismiss
 * - Different styles for types
 * - Slide-in animation
 * - Accessible (role="alert")
 *
 * @param props - ToastProps
 * @returns JSX toast element
 */
export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
    }
  };

  return (
    <div
      className={`toast toast-${type}`}
      role="alert"
      aria-live="polite"
      onClick={onClose}
    >
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
 