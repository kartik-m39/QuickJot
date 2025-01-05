function getGreeting(username) {
    const now = new Date();
    console.log(now);
    const hours = now.getHours(); // Extract the current hour
    let greeting;

    // Determine the greeting based on the time of day
    if (hours < 12) {
        greeting = "Good Morning!";
    } else if (hours < 18) {
        greeting = "Good Afternoon!";
    } else {
        greeting = "Good Evening!";
    }

    // Include the username if available otherwise only greeting
    return username ? `${greeting} ${username}` : `${greeting}`; 
}

function updateGreeting() {
    const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));
    const username = signedInUser ? signedInUser.username : null;

    const greetingMessage = getGreeting(username);
    const greetingElement = document.getElementById('greeting');
    
    if (greetingElement) {
        greetingElement.textContent = greetingMessage;
    }
}

function logout() {
    localStorage.removeItem('signedInUser'); // Clear signed-in user
    setTimeout(() => {window.location.href = 'index.html';}, 1500); 
}


function populateTask(){
    console.log("populateTask function called");
    const task = document.querySelector('#task').value.trim();
    console.log("Task input value:", task); 
    const tasklist = document.querySelector('#task-list');
    
    if(!task){
        alert("Please enter a task.");
        return; //Prevent adding an empty list
    }

    const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));
    const username = signedInUser ? signedInUser.username : null;

    if (!username) {
        alert("User not signed in. Please log in.");
        return;
    }

    // Retrieve tasks from localStorage or initialize
    let tasks = JSON.parse(localStorage.getItem(`tasks_${username}`)) || [];
    tasks.push(task); // Add new task
    localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));

    const newtask = document.createElement('li');
    newtask.textContent = task;

    const dustbin = document.createElement('button');
    dustbin.className = "delete-icon";
    dustbin.setAttribute("onclick", "removetask(this, `${task}`)");
    dustbin.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" fill="black">
            <path d="M261 991q-33 0-55-22t-22-55V300h-43v-60h224v-43h250v43h223v60h-42v614q0 33-22 55t-55 22H261Zm438-691H260v614h439V300Zm-393 580h60V360h-60v520Zm167 0h60V360h-60v520Zm166 0h60V360h-60v520ZM260 300v614-614Z"/>
        </svg>`;

    newtask.append(dustbin);

    const checkbox = document.createElement('input');
    checkbox.className = "checkbox";
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("onclick", "strikeTask(this)");
    newtask.prepend(checkbox);

    tasklist.prepend(newtask);

    // Clear the input field after adding task
    document.querySelector('#task').value = '';
    console.log("Task added and input cleared")
}

document.querySelector('#task').addEventListener("keypress",(event)=> {
    if(event.key ==="Enter"){
        event.preventDefault();
        populateTask();
    }
})

// Load tasks for the signed-in user
function loadTasks() {
    const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));
    const username = signedInUser ? signedInUser.username : null;

    if (!username) {
        alert("User not signed in. Please log in.");
        return;
    }

    const tasks = JSON.parse(localStorage.getItem(`tasks_${username}`)) || [];
    const tasklist = document.querySelector('#task-list');

    tasklist.innerHTML = ""; // Clear existing tasks

    tasks.forEach(task => {
        const newtask = document.createElement('li');
        newtask.textContent = task;

        const dustbin = document.createElement('button');
        dustbin.className = "delete-icon";
        dustbin.setAttribute("onclick", `removetask(this, '${task}')`);
        dustbin.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" fill="black">
                <path d="M261 991q-33 0-55-22t-22-55V300h-43v-60h224v-43h250v43h223v60h-42v614q0 33-22 55t-55 22H261Zm438-691H260v614h439V300Zm-393 580h60V360h-60v520Zm167 0h60V360h-60v520Zm166 0h60V360h-60v520ZM260 300v614-614Z"/>
            </svg>`;
        newtask.append(dustbin);

        const checkbox = document.createElement('input');
        checkbox.className = "checkbox";
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("onclick", "strikeTask(this)");
        newtask.prepend(checkbox);

        tasklist.prepend(newtask);
    });
}

function removetask(button, task){
    console.log("remove task button clicked");

    const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));
    const username = signedInUser ? signedInUser.username : null;

    if (!username) {
        alert("User not signed in. Please log in.");
        return;
    }

    // Retrieve tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem(`tasks_${username}`)) || [];
    tasks = tasks.filter(t => t !== task); // Remove the task
    localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));

    button.parentElement.remove();
    console.log("Task removed");
}

function strikeTask(checkbox){
    console.log("Strike task checkbox clicked");
    const task = checkbox.parentElement;
    task.classList.toggle('completed');
    console.log("Task status changed");

    if(task.classList.contains('completed')){
        // move to completed section
        document.querySelector('#task-list').appendChild(task);
        document.querySelector('.bottom-container').scrollIntoView({ behavior: 'smooth' });
    }
    else{
        // return back to the task list
        document.querySelector('#task-list').prepend(task);
    }
}


const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/quote';

async function getQuote(api_url){
    try{
        const response = await fetch(api_url);
        const data = await response.json();
        console.log(data);
        displayQuote(data);
    }
    catch(error){
        console.error('Error fetching quote:', error);
        alert('Error fetching quote. Please try again.');
    }
}


function displayQuote(data) {
    const quote = document.querySelector('#quote');
    const author = document.querySelector('#author');
    const src = document.querySelector('#source');

    // Safely extract quote data
    if (data && data.length > 0) {
        const quoteText = data[0].q;
        const authorText = data[0].a;

        quote.textContent = `"${quoteText}"`; // Display quote
        author.textContent = `-${authorText}`; // Display author
        src.innerHTML = `Inspirational quotes provided by 
                         <a href="https://zenquotes.io/" target="_blank">ZenQuotes API</a>.`;  // Source info
    } else {
        console.error("No quote data available.");
    }
}


function populateProfile(){
    const signedInUser = JSON.parse(localStorage.getItem('signedInUser'));
    const username = signedInUser ? signedInUser.username : null;
    const email = signedInUser ? signedInUser.email : null;

    if (!username) {
        alert("User not signed in. Please log in.");
        return;
    }

    document.querySelector('#name').textContent = ` Name: ${username}`;
    document.querySelector('#email').textContent = `Email: ${email}`;

    const now = new Date();
    console.log(now);
    const day = now.getDate();
    
    const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const time = now.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: false});

    const date = document.querySelector('#date');
    date.innerHTML = `${day} ${month}, ${year}<br>${time}`;
}

function toggleProfile() {
    const profileContainer = document.getElementById('profileContainer');
    profileContainer.classList.toggle('open');
}


document.addEventListener('DOMContentLoaded', function(){
    populateProfile();
    updateGreeting();
    loadTasks();
    getQuote(api_url);
});
