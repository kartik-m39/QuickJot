const form = document.querySelector(".account-form");
const registerBtn = document.querySelector(".submit-btn");
const signupContainer = document.querySelector(".container");

// Create a function to display the success popup
function showSuccessPopup() {
    const successPopup = document.createElement('div');
    successPopup.classList.add('success-popup');
    
    // Green check mark
    successPopup.innerHTML = `
        <div class="popup-content">
            <span class="popup-icon">&#10004;</span>
            <span class="popup-message">Account created successfully! Redirecting to home page.</span>
        </div>
    `;

    // Append the success popup to the body
    document.body.appendChild(successPopup);
}

// Create a function to display an error message
function showError(message) {
    const errorPopup = document.createElement('div');
    errorPopup.classList.add('error-popup');
    
    errorPopup.innerHTML = `
        <div class="popup-content">
            <span class="popup-icon">&#10060;</span>
            <span class="popup-message">${message}</span>
        </div>
    `;

    // Append the error popup to the body
    document.body.appendChild(errorPopup);

    // Remove the error popup after 3 seconds
    setTimeout(() => {
        errorPopup.remove();
    }, 2000);
}

registerBtn.addEventListener("click", (event) => {
    event.preventDefault();  // Prevent the default form submission

    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;

    // Validation checks
    if (!username || !email || !password) {
        showError("All fields are required.");
        return;
    }

    if (password.length < 8) {
        showError("Password must be at least 8 characters long.");
        return;
    }

    if(password != confirmPassword){
        showError("Passwords do not match.");
        return;
    }
    
    // Create a user object
    const user = {
        username: username,
        email: email,
        password: password // Ideally, hash this before saving
    };

    // Save user data in localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.username === username || u.email === email);

    if (existingUser) {
        showError("Username or email already exists.");
        return;
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    // Call the function to display the success popup
    showSuccessPopup();

    // Redirect after the popup is removed (so logs are visible before redirection)
    setTimeout(() => {
        window.location.href = 'index.html';  // Redirect to the home page
    }, 3000);
});
