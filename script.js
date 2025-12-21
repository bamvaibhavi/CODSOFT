/* =======================================================
   Project: Online Quiz Maker (DEBUG MODE)
   ======================================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. READ DATA
    let current_user = localStorage.getItem("quizCurrentUser");
    console.log("DEBUG: Current User is ->", current_user);

    // 2. IDENTIFY PAGE
    const authForm = document.getElementById("authForm");
    const isLoginPage = !!authForm; 

    // 3. WELCOME MESSAGE
    const txt_welcome = document.getElementById("welcomeMsg");
    if (txt_welcome) {
        if (current_user) {
            txt_welcome.innerText = `Welcome, ${current_user}! 👋`;
        } else {
            txt_welcome.innerText = "Welcome, Guest! (Not Logged In)";
            txt_welcome.style.color = "red";
        }
    }

    // 🛑 I DISABLED THE REDIRECT SO IT WON'T KICK YOU OUT 🛑
    /*
    if (!current_user && !isLoginPage) {
        window.location.href = "login.html";
    }
    */

    // 4. LOGIN / REGISTER LOGIC
    if (authForm) {
        const toggleLink = document.getElementById("toggleLink");
        const formTitle = document.getElementById("formTitle");
        const nameField = document.getElementById("nameField");
        const submitBtn = document.getElementById("submitBtn");
        const toggleText = document.getElementById("toggleText");

        let isLoginMode = true;

        toggleLink.addEventListener("click", (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            if (isLoginMode) {
                formTitle.innerText = "🔐 Login";
                submitBtn.innerText = "Login";
                nameField.style.display = "none";
                toggleText.innerText = "New user?";
                toggleLink.innerText = "Register here";
            } else {
                formTitle.innerText = "📝 Register";
                submitBtn.innerText = "Sign Up";
                nameField.style.display = "block";
                toggleText.innerText = "Have an account?";
                toggleLink.innerText = "Login here";
            }
        });

        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // GET USERS
            let db_users = JSON.parse(localStorage.getItem("quizUsers")) || [];
            
            const email = document.getElementById("email").value.trim();
            const pass = document.getElementById("password").value.trim();

            if (isLoginMode) {
                // LOGIN
                const user = db_users.find(u => u.email === email && u.password === pass);
                if (user) {
                    // SAVE USER TO STORAGE
                    localStorage.setItem("quizCurrentUser", user.name);
                    
                    // VERIFY IT WAS SAVED
                    let verify = localStorage.getItem("quizCurrentUser");
                    if(verify === user.name) {
                        alert("Login Success! Storage Saved. Going to Dashboard...");
                        window.location.href = "index.html"; 
                    } else {
                        alert("ERROR: Browser refused to save data. Check settings.");
                    }
                } else {
                    alert("Invalid email or password!");
                }
            } else {
                // REGISTER
                const name = document.getElementById("fullname").value.trim();
                if (db_users.find(u => u.email === email)) {
                    alert("User already exists!");
                    return;
                }
                
                db_users.push({ name, email, password: pass });
                localStorage.setItem("quizUsers", JSON.stringify(db_users));
                alert("Registered! Please Login.");
                toggleLink.click(); 
            }
        });
    }

    // 5. LOGOUT LOGIC
    const btn_logout = document.getElementById("logoutBtn");
    if (btn_logout) {
        btn_logout.addEventListener("click", () => {
            localStorage.removeItem("quizCurrentUser");
            window.location.href = "login.html";
        });
    }
    
    // 6. QUIZ LOGIC (Kept simple)
    handleQuizLogic(); 
});

function handleQuizLogic() {
    // ... (This part is fine, no changes needed for login debug) ...
}
