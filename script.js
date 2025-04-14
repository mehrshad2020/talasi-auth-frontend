document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const phoneForm = document.getElementById('phoneForm');
    const otpForm = document.getElementById('otpForm');
    const phoneSlide = document.getElementById('phoneSlide');
    const otpSlide = document.getElementById('otpSlide');
    const phoneInput = document.getElementById('phoneNumber');
    const userPhoneSpan = document.getElementById('userPhone');
    const resendButton = document.getElementById('resendCode');
    const countdownSpan = document.getElementById('countdown');
    const otpInputs = otpForm.querySelectorAll('input[type="text"]');

    // Phone number validation
    function validatePhoneNumber(phone) {
        const phoneRegex = /^09[0-9]{9}$/;
        return phoneRegex.test(phone);
    }

    // Handle phone form submission
    phoneForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const phoneNumber = phoneInput.value.trim();

        if (!validatePhoneNumber(phoneNumber)) {
            phoneInput.classList.add('is-invalid');
            return;
        }

        phoneInput.classList.remove('is-invalid');
        userPhoneSpan.textContent = phoneNumber;
        
        // Switch to OTP slide
        phoneSlide.classList.remove('active');
        otpSlide.classList.add('active');
        
        // Start countdown timer
        startCountdown();
        
        // Focus first OTP input
        otpInputs[0].focus();
    });

    // Phone input validation on input
    phoneInput.addEventListener('input', function(e) {
        if (e.target.value.length > 11) {
            e.target.value = e.target.value.slice(0, 11);
        }
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        
        if (validatePhoneNumber(e.target.value)) {
            e.target.classList.remove('is-invalid');
        }
    });

    // OTP input handling
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            // Remove non-numeric characters
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            // Move to next input if value is entered
            if (e.target.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', function(e) {
            // Move to previous input on backspace if current input is empty
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // Handle OTP form submission
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect OTP digits
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        
        if (otp.length !== 5) {
            otpInputs.forEach(input => input.classList.add('is-invalid'));
            return;
        }

        otpInputs.forEach(input => input.classList.remove('is-invalid'));
        // Here you would typically send the OTP to your server for verification
        console.log('OTP submitted:', otp);
    });

    // Countdown timer functionality
    function startCountdown() {
        let timeLeft = 120; // 2 minutes
        resendButton.disabled = true;
        
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            countdownSpan.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                resendButton.disabled = false;
                countdownSpan.parentElement.style.display = 'none';
            }
            
            timeLeft--;
        }, 1000);
    }

    // Handle resend code button
    resendButton.addEventListener('click', function() {
        if (!resendButton.disabled) {
            // Here you would typically make an API call to resend the code
            countdownSpan.parentElement.style.display = 'block';
            startCountdown();
            console.log('Resending code...');
        }
    });
}); 