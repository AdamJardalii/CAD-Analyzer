const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit',  async (e) =>{
    e.preventDefault();
    
    let isValid = validateForm();
    const emailValue = email.value;
    const passwordValue = password.value;

    if (isValid) {
        try {
            const result = await API.login(emailValue, passwordValue);

            if(result.success){
                const { token } = result.data;
                Storage.saveToken(token);
                form.reset();
                Navigation.goToHome();
            } else {
                showServerError(result.error, result.statusCode);
            }
    } catch (err) {
        showServerError("Network error. Please try again.", 500);
    }
    }
});

email.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        hideError('emailError');
        this.classList.remove('error');
    }
});

password.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        hideError('passwordError');
        this.classList.remove('error');
    }
});

function showError(id, message) {
    const errorEl = document.getElementById(id);
    errorEl.textContent = message;
    errorEl.classList.add('show');
}

function hideError(id) {
    const errorEl = document.getElementById(id);
    errorEl.classList.remove('show');
}

function validateForm(){
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showError('emailError', 'Please enter a valid email address');
        email.classList.add('error');
        isValid = false;
    } else {
        hideError('emailError');
        email.classList.remove('error');
        email.classList.add('success');
    }

    if (password.value.trim() === '') {
        showError('passwordError', 'Please enter your password');
        password.classList.add('error');
        isValid = false;
    } else if (password.value.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters');
        password.classList.add('error');
        isValid = false;
    } else {
        hideError('passwordError');
        password.classList.remove('error');
        password.classList.add('success');
    }

    return isValid;
}

function showServerError(errorMessage, statusCode) {
    UI.hideError('emailError');
    UI.hideError('passwordError');
    
    switch(statusCode) {
        case 401:
            UI.showError('emailError', errorMessage);
            UI.markAsError(email);
            UI.markAsError(password);
            break;
            
        case 400: 
            if (errorMessage.toLowerCase().includes('email')) {
                UI.showError('emailError', errorMessage);
                UI.markAsError(email);
            } else if (errorMessage.toLowerCase().includes('password')) {
                UI.showError('passwordError', errorMessage);
                UI.markAsError(password);
            } else {
                UI.showError('emailError', errorMessage);
                UI.markAsError(email);
            }
            break;
            
        case 500:
            UI.showError('emailError', 'Invalid email or password. Please try again.');
            break;
            
        default:
            UI.showError('emailError', errorMessage);
            UI.markAsError(email);
            UI.markAsError(password);
    }
    
}
