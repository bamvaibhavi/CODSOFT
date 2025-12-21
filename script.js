/* =======================================================
   Project: Online Quiz Maker (FORCE REDIRECT FIX)
   ======================================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. CHECK CURRENT USER
    let current_user = localStorage.getItem("quizCurrentUser");
    console.log("Current Session User:", current_user);

    // 2. CHECK IF WE ARE ON LOGIN PAGE
    const authForm = document.getElementById("authForm");
    
    // 3. SECURITY REDIRECT (Only if NOT on login page)
    // If you are NOT logged in, and NOT on login page, KICK to login.
    if (!current_user && !authForm) {
        console.log("User not found. Redirecting to Login...");
        window.location.href = "login.html";
    }

    // 4. DASHBOARD REDIRECT (Only if ON login page)
    // If you ARE logged in, and ON login page, JUMP to Dashboard.
    if (current_user && authForm) {
        console.log("User found. Redirecting to Dashboard...");
        window.location.replace("index.html"); // Force Jump
    }

    // 5. LOGIN FORM HANDLER
    if (authForm) {
        const toggleLink = document.getElementById("toggleLink");
        const formTitle = document.getElementById("formTitle");
        const submitBtn = document.getElementById("submitBtn");
        const nameField = document.getElementById("nameField");
        const toggleText = document.getElementById("toggleText");

        let isLoginMode = true;

        // Toggle Login/Register
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

        // HANDLE SUBMIT
        authForm.addEventListener("submit", (e) => {
            e.preventDefault(); // STOP Page Reload
            console.log("Form Submitted...");

            let db_users = JSON.parse(localStorage.getItem("quizUsers")) || [];
            const email = document.getElementById("email").value.trim();
            const pass = document.getElementById("password").value.trim();

            if (isLoginMode) {
                // --- LOGIN LOGIC ---
                const user = db_users.find(u => u.email === email && u.password === pass);
                
                if (user) {
                    console.log("Login Credentials Correct!");
                    localStorage.setItem("quizCurrentUser", user.name);
                    
                    // 🚨 FORCE REDIRECT 🚨
                    alert("Login Success! Click OK to go to Dashboard.");
                    window.location.replace("index.html"); 
                } else {
                    alert("Invalid email or password!");
                }
            } else {
                // --- REGISTER LOGIC ---
                const name = document.getElementById("fullname").value.trim();
                if (db_users.find(u => u.email === email)) {
                    alert("User already exists!");
                    return;
                }
                
                db_users.push({ name, email, password: pass });
                localStorage.setItem("quizUsers", JSON.stringify(db_users));
                alert("Registered! Please Login.");
                location.reload(); // Refresh to switch to login view cleanly
            }
        });
    }

    // 6. LOGOUT LOGIC
    const btn_logout = document.getElementById("logoutBtn");
    if (btn_logout) {
        btn_logout.addEventListener("click", () => {
            localStorage.removeItem("quizCurrentUser");
            window.location.href = "login.html";
        });
    }

    // 7. WELCOME MESSAGE
    const txt_welcome = document.getElementById("welcomeMsg");
    if (txt_welcome && current_user) {
        txt_welcome.innerText = `Welcome, ${current_user}! 👋`;
    }

    // 8. QUIZ LOGIC
    handleQuizLogic();
});

// Helper function (unchanged)
function handleQuizLogic() {
    let db_questions = JSON.parse(localStorage.getItem("quizData")) || [];
    // ... (Your existing create/quiz logic works fine) ...
    const form_create = document.getElementById("createForm");
    if (form_create) {
        form_create.addEventListener("submit", (e) => {
            e.preventDefault();
            const q = document.getElementById("question").value;
            const a = document.getElementById("optA").value;
            const b = document.getElementById("optB").value;
            const c = document.getElementById("optC").value;
            const d = document.getElementById("optD").value;
            const correct = document.getElementById("correct").value;
            db_questions.push({ question: q, a, b, c, d, correct });
            localStorage.setItem("quizData", JSON.stringify(db_questions));
            alert("Question Saved!");
            form_create.reset();
        });
    }
}
