document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.querySelector("#register-btn");
    const signInButton = document.querySelector("#sign-in-btn");
    const signInForm = document.querySelector("#sign-in-form");

    registerButton.addEventListener("click", () => {
        signInForm.classList.toggle("hidden");
    });

    signInButton.addEventListener("click", () => {
        signInForm.classList.toggle("hidden");
    });

    function showSuccessPopup() {
        // Reference the form container
        const formPage = document.querySelector("#sign-in-form");
    
        // Create the success popup element
        const successPopup = document.createElement('div');
        successPopup.classList.add('success-popup');

        successPopup.innerHTML = `
            <div class="popup-content">
                <span class="popup-icon">&#10004;</span>
                <p class="popup-message">Login Successful! Redirecting to dashboard...</p>
            </div>
        `;

        formPage.appendChild(successPopup);
    
        // Redirect after 3 seconds
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 3000); // Redirect after 3 seconds
    }
    

    const form = document.getElementById('sign-in-form-inner');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        
        // Remove any previous messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (user) {
            // Save the current signed-in user in localStorage
            localStorage.setItem('signedInUser', JSON.stringify(user));
            showSuccessPopup();
        } else {
            // Display an error message below the form
            const messageDiv = document.createElement('div');
            messageDiv.textContent = "Invalid username or password!";
            messageDiv.style.color = "red";
            messageDiv.style.textAlign = "center";
            messageDiv.style.marginTop = "15px";
            messageDiv.className = "message";
            form.appendChild(messageDiv);
        }
    });
});

