import { useCallback } from 'react';
import { useMessage } from '@layout/MessageProvider';

export const useErrorHandler = () => {
    const message = useMessage();
    const handleThunkError = useCallback((error: string | null | undefined, fallbackMessage: string = 'Có lỗi xảy ra') => {
        if (error) {
            message.error(error);
        } else {
            message.error(fallbackMessage);
        }
    }, [message]);
    const handleCatchError = useCallback((error: any, fallbackMessage: string = 'Có lỗi xảy ra') => {
        const errorMessage = error?.message || error?.toString() || fallbackMessage;
        message.error(errorMessage);
    }, [message]);
    const handleContextError = useCallback((error: string | null | undefined, context: string) => {
        if (error) {
            message.error(`${context}: ${error}`);
        } else {
            message.error(`${context} thất bại`);
        }
    }, [message]);
    const handleValidationError = useCallback((errors: Record<string, string[]>) => {
        const errorMessages = Object.values(errors).flat();
        if (errorMessages.length > 0) {
            message.error(errorMessages.join(', '));
        }
    }, [message]);

    return {
        handleThunkError,
        handleCatchError,
        handleContextError,
        handleValidationError,
    };
}; 