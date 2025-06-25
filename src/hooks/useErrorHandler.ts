import { useCallback } from 'react';
import { useMessage } from '../layout/MessageProvider';

/**
 * Custom hook để xử lý lỗi một cách nhất quán trong components
 * @returns Object chứa các function xử lý lỗi
 */
export const useErrorHandler = () => {
    const message = useMessage();

    /**
     * Xử lý lỗi từ Redux thunk
     * @param error - Error message từ thunk
     * @param fallbackMessage - Message mặc định nếu không có error
     */
    const handleThunkError = useCallback((error: string | null | undefined, fallbackMessage: string = 'Có lỗi xảy ra') => {
        if (error) {
            message.error(error);
        } else {
            message.error(fallbackMessage);
        }
    }, [message]);

    /**
     * Xử lý lỗi từ try-catch
     * @param error - Error object từ catch
     * @param fallbackMessage - Message mặc định nếu không có error
     */
    const handleCatchError = useCallback((error: any, fallbackMessage: string = 'Có lỗi xảy ra') => {
        const errorMessage = error?.message || error?.toString() || fallbackMessage;
        message.error(errorMessage);
    }, [message]);

    /**
     * Xử lý lỗi với context
     * @param error - Error message
     * @param context - Context của lỗi (e.g., "Tạo bài viết", "Cập nhật thông tin")
     */
    const handleContextError = useCallback((error: string | null | undefined, context: string) => {
        if (error) {
            message.error(`${context}: ${error}`);
        } else {
            message.error(`${context} thất bại`);
        }
    }, [message]);

    /**
     * Xử lý lỗi validation
     * @param errors - Validation errors object
     */
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