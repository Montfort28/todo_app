// Toggle password visibility
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const eyeIcon = event.currentTarget.querySelector('i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Password validation for registration
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        const passwordField = document.getElementById('password');
        const confirmPasswordField = document.getElementById('confirm-password');
        const lengthRequirement = document.getElementById('length');
        const uppercaseRequirement = document.getElementById('uppercase');
        const lowercaseRequirement = document.getElementById('lowercase');
        const numberRequirement = document.getElementById('number');
        
        passwordField.addEventListener('input', function() {
            const password = this.value;
            
            // Check password length
            if (password.length >= 8) {
                lengthRequirement.classList.add('valid');
                lengthRequirement.innerHTML = '✓ At least 8 characters';
                lengthRequirement.style.color = 'green';
            } else {
                lengthRequirement.classList.remove('valid');
                lengthRequirement.innerHTML = 'At least 8 characters';
                lengthRequirement.style.color = '';
            }
            
            // Check uppercase letter
            if (/[A-Z]/.test(password)) {
                uppercaseRequirement.classList.add('valid');
                uppercaseRequirement.innerHTML = '✓ At least one uppercase letter';
                uppercaseRequirement.style.color = 'green';
            } else {
                uppercaseRequirement.classList.remove('valid');
                uppercaseRequirement.innerHTML = 'At least one uppercase letter';
                uppercaseRequirement.style.color = '';
            }
            
            // Check lowercase letter
            if (/[a-z]/.test(password)) {
                lowercaseRequirement.classList.add('valid');
                lowercaseRequirement.innerHTML = '✓ At least one lowercase letter';
                lowercaseRequirement.style.color = 'green';
            } else {
                lowercaseRequirement.classList.remove('valid');
                lowercaseRequirement.innerHTML = 'At least one lowercase letter';
                lowercaseRequirement.style.color = '';
            }
            
            // Check number
            if (/\d/.test(password)) {
                numberRequirement.classList.add('valid');
                numberRequirement.innerHTML = '✓ At least one number';
                numberRequirement.style.color = 'green';
            } else {
                numberRequirement.classList.remove('valid');
                numberRequirement.innerHTML = 'At least one number';
                numberRequirement.style.color = '';
            }
        });
        
        registerForm.addEventListener('submit', function(e) {
            const password = passwordField.value;
            const confirmPassword = confirmPasswordField.value;
            
            // Check if passwords match
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match!');
                return false;
            }
            
            // Check if password meets all requirements
            if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
                e.preventDefault();
                alert('Password does not meet all requirements!');
                return false;
            }
        });
    }
});