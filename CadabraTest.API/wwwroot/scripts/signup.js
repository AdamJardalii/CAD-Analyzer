const form = document.getElementById('signupForm');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const strengthBar = document.getElementById('strengthBar');

password.addEventListener('input', function() {
    const val = this.value;
    const strength = checkPasswordStrength(val);
    
    strengthBar.className = 'strength-bar-fill';
    if (val.length > 0) {
        if (strength < 3) strengthBar.classList.add('strength-weak');
        else if (strength < 5) strengthBar.classList.add('strength-medium');
        else strengthBar.classList.add('strength-strong');
    }
});

function checkPasswordStrength(pwd) {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
}

confirmPassword.addEventListener('input', function() {
    checkPasswordMatch();
});

password.addEventListener('input', function() {
    if (confirmPassword.value) {
        checkPasswordMatch();
    }
});

function checkPasswordMatch() {
    const confirmError = document.getElementById('confirmError');
    const confirmSuccess = document.getElementById('confirmSuccess');
    
    if (confirmPassword.value === '') {
        confirmPassword.classList.remove('error', 'success');
        confirmError.classList.remove('show');
        confirmSuccess.classList.remove('show');
        return;
    }
    
    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('error');
        confirmPassword.classList.remove('success');
        confirmError.textContent = 'Passwords do not match';
        confirmError.classList.add('show');
        confirmSuccess.classList.remove('show');
    } else {
        confirmPassword.classList.remove('error');
        confirmPassword.classList.add('success');
        confirmError.classList.remove('show');
        confirmSuccess.classList.add('show');
    }
}

// Form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    let isValid = true;

    // Validate name
    if (name.value.trim() === '') {
        showError('nameError', 'Please enter your name');
        name.classList.add('error');
        isValid = false;
    } else {
        hideError('nameError');
        name.classList.remove('error');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showError('emailError', 'Please enter a valid email address');
        email.classList.add('error');
        isValid = false;
    } else {
        hideError('emailError');
        email.classList.remove('error');
    }

    // Validate password
    if (password.value.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters');
        password.classList.add('error');
        isValid = false;
    } else {
        hideError('passwordError');
        password.classList.remove('error');
    }

    // Validate password match
    if (password.value !== confirmPassword.value) {
        showError('confirmError', 'Passwords do not match');
        confirmPassword.classList.add('error');
        isValid = false;
    } else {
        hideError('confirmError');
        confirmPassword.classList.remove('error');
    }

    if (isValid) {
        try{
            const result = await API.signup(email.value, password.value,name.value);
            console.log("result:",result)
            if(result.success){
                const { message } = result.data;
                Navigation.goToLogin();
                form.reset();
            }
            else{
                showServerError(result.error, "");
            }
            strengthBar.className = 'strength-bar-fill';
            document.getElementById('confirmSuccess').classList.remove('show');
        }
        catch(e){
            console.log("here:",e);
            showServerError(e.message, "");
        }
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
            UI.showError('emailError', 'Server error. Please try again later.');
            break;
            
        default:
            UI.showError('emailError', errorMessage);
            UI.markAsError(email);
            UI.markAsError(password);
    }
    
    UI.showAlert(errorMessage, 'error');
}
