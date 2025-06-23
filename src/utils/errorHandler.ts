/**
 * Utility function để xử lý lỗi API một cách nhất quán
 * @param error - Error object từ axios hoặc fetch
 * @returns Formatted error message string
 */
export const handleApiError = (error: any): string => {
    if (error.response) {
        const data = error.response.data;
        // Ưu tiên trả về message, error, hoặc nối các trường khác thành string
        if (typeof data === "string") return data;
        if (data?.message) return data.message;
        if (data?.error) return data.error;
        if (data?.errors) {
            if (Array.isArray(data.errors)) return data.errors.join(", ");
            if (typeof data.errors === "object") return Object.values(data.errors).flat().join(", ");
            return String(data.errors);
        }
        return JSON.stringify(data) || 'Server error';
    } else if (error.request) {
        return 'No response from server';
    } else {
        return error.message || 'Unknown error';
    }
};

/**
 * Utility function để log error với context
 * @param context - Context của error (e.g., "Post API", "User API")
 * @param error - Error object
 * @param additionalInfo - Additional information to log
 */
export const logApiError = (context: string, error: any, additionalInfo?: any) => {
    console.error(`[${context}] Error:`, {
        error,
        additionalInfo,
        timestamp: new Date().toISOString()
    });
}; 