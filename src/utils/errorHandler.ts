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
export const logApiError = (context: string, error: any, additionalInfo?: any) => {
    console.error(`[${context}] Error:`, {
        error,
        additionalInfo,
        timestamp: new Date().toISOString()
    });
}; 