import { useEffect, useRef, useState } from "react";

/**
 * Debounce hook for state updates
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup on unmount or when value/delay changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for state updates
 * @param {any} value - The value to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {any} - Throttled value
 */
export function useThrottle(value, limit = 300) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdateRef = useRef(0);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;

    const now = Date.now();
    const timeElapsed = now - lastUpdateRef.current;

    if (timeElapsed >= limit) {
      // If enough time has passed, update immediately
      lastUpdateRef.current = now;
      setThrottledValue(value);
    } else {
      // Otherwise, schedule an update
      const timerId = setTimeout(() => {
        lastUpdateRef.current = Date.now();
        setThrottledValue(valueRef.current);
      }, limit - timeElapsed);

      return () => clearTimeout(timerId);
    }
  }, [value, limit]);

  return throttledValue;
}

/**
 * Batch updates hook for reducing state updates
 * @param {Function} updateFn - The update function to batch
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Batched update function
 */
export function useBatchUpdates(updateFn, delay = 100) {
  const batchRef = useRef([]);
  const timerRef = useRef(null);

  const batchedUpdateFn = (...args) => {
    // Add to batch
    batchRef.current.push(args);

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      // Process all batched updates at once
      if (batchRef.current.length > 0) {
        updateFn(batchRef.current);
        batchRef.current = [];
      }
    }, delay);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return batchedUpdateFn;
}
