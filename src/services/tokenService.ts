const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const isLocalStorageAvailable = () => {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
};

export const tokenService = {
    getToken: () => {
        if (!isLocalStorageAvailable()) {
            console.warn('LocalStorage is not available');
            return null;
        }
        return localStorage.getItem(TOKEN_KEY);
    },
    setToken: (token: string) => {
        if (!isLocalStorageAvailable()) {
            console.warn('LocalStorage is not available');
            return;
        }
        if (!token) {
            console.warn('Attempting to set empty token');
            return;
        }
        localStorage.setItem(TOKEN_KEY, token);
    },
    removeUser: () => {
        if (!isLocalStorageAvailable()) {
            console.warn('LocalStorage is not available');
            return;
        }
        localStorage.removeItem(USER_KEY);
    },
    removeTokens: () => {
        if (!isLocalStorageAvailable()) {
            console.warn('LocalStorage is not available');
            return;
        }
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
    hasValidToken: () => {
        const token = tokenService.getToken();
        return !!token;
    }
}; 