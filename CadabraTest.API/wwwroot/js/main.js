const API_URL = "http://localhost:5000/api";

const Storage = {
    saveToken(token) {
        localStorage.setItem("jwtToken", token);
    },
    getToken() {
        return localStorage.getItem("jwtToken");
    },
     removeToken() {
        localStorage.removeItem('authToken');
    },
    clearAll() {
        localStorage.clear();
    }
};

const API = {
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message };
        }
    },
};