import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@store/redux';

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