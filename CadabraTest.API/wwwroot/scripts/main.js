const API_URL = "https://cad-analyzer-production-b9f3.up.railway.app/api";
const authPages = ["login.html", "signup.html"];

const Storage = {
    saveToken(token) {
        localStorage.setItem("jwtToken", token);
    },
    getToken() {
        return localStorage.getItem("jwtToken");
    },
     removeToken() {
        localStorage.removeItem('jwtToken');
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
            if (response.status == 401 && window.location.pathname != "/login.html") {
                Storage.removeToken();
                localStorage.removeItem('token');
                Navigation.goToLogin();
                return { success: false, error: 'Unauthorized, please login again.',statusCode:response.status };
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return { success: true, data,statusCode:response.status };
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: error.message,statusCode:error.status };
        }
    },
       async login(email, password) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    async signup(email, password,username) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({email,password,username})
        });
    },

    async fetchAll() {
        const token = Storage.getToken();
        return await this.request('/cad/all', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    },

    async deleteAnalysis(id){
        const token = Storage.getToken();
        return await this.request(`/cad/analysis/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
    },
    async uploadAnalysis(file,selectedAnalysisType) {
        const token = Storage.getToken();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("analysisType", selectedAnalysisType);

        try {
            const res = await fetch(`${API_URL}/cad/analyze`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            if (res.status == 401 && window.location.pathname !== "/login.html") {
                Storage.removeToken();
                localStorage.removeItem('token');
                Navigation.goToLogin();
                return { success: false, error: 'Unauthorized, please login again.',statusCode:res.status};
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Upload failed");
            }

            return { success: true, data,statusCode:res.status };

        } catch (error) {
            console.error("Upload Error:", error);
            return { success: false, error: error.message,statusCode:error.status };
        }
    }
};

const Navigation = {
    goToLogin() {
        window.location.href = 'login.html';
    },

    goToSignup() {
        window.location.href = 'signup.html';
    },

    goToHome() {
        window.location.href = 'index.html';
    }
};

const FormHelper = {
    clearForm(formElement) {
        formElement.reset();
        const inputs = formElement.querySelectorAll('input');
        inputs.forEach(input => UI.clearInputStyle(input));
    },

    setupClearErrorOnInput(inputElement, errorElementId) {
        inputElement.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                UI.hideError(errorElementId);
                UI.clearInputStyle(this);
            }
        });
    }
};

const FormValidator = {
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validatePassword(password, minLength = 6) {
        return password.trim() !== '' && password.length >= minLength;
    },

    validateName(name) {
        return name.trim() !== '' && name.length >= 2;
    },

    checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    },

    passwordsMatch(password, confirmPassword) {
        return password === confirmPassword && password !== '';
    }
};

const UI = {
    showError(elementId, message) {
        const errorEl = document.getElementById(elementId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    },

    hideError(elementId) {
        const errorEl = document.getElementById(elementId);
        if (errorEl) {
            errorEl.classList.remove('show');
        }
    },

    markAsError(inputElement) {
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
    },

    markAsSuccess(inputElement) {
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
    },

    clearInputStyle(inputElement) {
        inputElement.classList.remove('error', 'success');
    },

    showLoading(buttonElement, loadingText = 'Loading...') {
        buttonElement.disabled = true;
        buttonElement.dataset.originalText = buttonElement.textContent;
        buttonElement.textContent = loadingText;
    },

    hideLoading(buttonElement) {
        buttonElement.disabled = false;
        buttonElement.textContent = buttonElement.dataset.originalText || 'Submit';
    },

    showAlert(message, type = 'info') {
        alert(message);
    }
};

(function checkAuth() {
    const token = Storage.getToken();
    const currentPage = window.location.pathname.split("/").pop();


    if (token && authPages.includes(currentPage)) {
        window.location.href = "index.html";
        return;
    }
    
    if(!token && !authPages.includes(currentPage)){
        window.location.href = "login.html";
        return;
    }
})();
