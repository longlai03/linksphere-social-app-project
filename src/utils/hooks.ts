import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/redux';

/**
 * Custom hook để tránh gọi API nhiều lần không cần thiết
 * @param apiCall - Function gọi API
 * @param dependencies - Dependencies của useEffect
 * @param shouldCall - Điều kiện để gọi API
 */
export const useApiCall = <T extends any[]>(
    apiCall: (...args: T) => any,
    dependencies: any[],
    shouldCall: boolean = true
) => {
    const dispatch = useDispatch<AppDispatch>();
    const hasCalledRef = useRef(false);

    const executeApiCall = useCallback(async (...args: T) => {
        if (!hasCalledRef.current && shouldCall) {
            hasCalledRef.current = true;
            try {
                await dispatch(apiCall(...args)).unwrap();
            } catch (error) {
                console.error('API call failed:', error);
                // Reset flag on error to allow retry
                hasCalledRef.current = false;
            }
        }
    }, [dispatch, apiCall, shouldCall]);

    useEffect(() => {
        hasCalledRef.current = false;
    }, dependencies);

    return executeApiCall;
};

/**
 * Custom hook để tránh gọi API khi component mount nhiều lần
 * @param apiCall - Function gọi API
 * @param dependencies - Dependencies của useEffect
 * @param shouldCall - Điều kiện để gọi API
 */
export const useMountApiCall = <T extends any[]>(
    apiCall: (...args: T) => any,
    dependencies: any[],
    shouldCall: boolean = true
) => {
    const dispatch = useDispatch<AppDispatch>();
    const hasMountedRef = useRef(false);

    const executeApiCall = useCallback(async (...args: T) => {
        if (!hasMountedRef.current && shouldCall) {
            hasMountedRef.current = true;
            try {
                await dispatch(apiCall(...args)).unwrap();
            } catch (error) {
                console.error('API call failed:', error);
            }
        }
    }, [dispatch, apiCall, shouldCall]);

    useEffect(() => {
        hasMountedRef.current = false;
    }, dependencies);

    return executeApiCall;
}; 