/* =======================================================
   Project: Online Quiz Maker (OPEN ACCESS VERSION)
   Status: NO REDIRECT LOOPS
   ======================================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. GET CURRENT USER
    let current_user = localStorage.getItem("quizCurrentUser");
    console.log("Current User:", current_user);

    // 2. CHECK WHICH PAGE WE ARE ON
    const authForm = document.getElementById("authForm"); // Login Page
    const welcomeMsg = document.getElementById("welcomeMsg"); // Dashboard

    // -----------------------------------------------------------
    // 🛑 SECURITY CHECK REMOVED
    // The code that forced you back to login is GONE.
    // The page will now STAY OPEN no matter what.
    // -----------------------------------------------------------

    // 3. DASHBOARD LOGIC (Index.html)
    if (welcomeMsg) {
        if (current_user) {
            welcomeMsg.innerText = `Welcome, ${current_user}! 👋`;
        } else {
            // If not logged in, just say Guest (Don't kick them out)
            welcomeMsg.innerText = "Welcome, Guest! (Open Mode)";
            welcomeMsg.style.color = "#666";
        }
    }

    // 4. LOGIN & REGISTER LOGIC (Login.html)
    if (authForm) {
        const toggleLink = document.getElementById("toggleLink");
        const formTitle = document.getElementById("formTitle");
        const submitBtn = document.getElementById("submitBtn");
        const nameField = document.getElementById("nameField");
        const toggleText = document.getElementById("toggleText");

        let isLoginMode = true;

        // Toggle Login / Register
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

        // Handle Submit
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            let db_users = JSON.parse(localStorage.getItem("quizUsers")) || [];
            const email = document.getElementById("email").value.trim();
            const pass = document.getElementById("password").value.trim();

            if (isLoginMode) {
                // LOGIN
                const user = db_users.find(u => u.email === email && u.password === pass);
                if (user) {
                    console.log("Login Success");
                    localStorage.setItem("quizCurrentUser", user.name);
                    alert("Login Success! Going to Dashboard...");
                    window.location.href = "index.html"; // Go to Dashboard
                } else {
                    alert("Invalid email or password!");
                }
            } else {
                // REGISTER
                const name = document.getElementById("fullname").value.trim();
                if (!name || !email || !pass) { alert("Fill all fields"); return; }
                
                if (db_users.find(u => u.email === email)) {
                    alert("User already exists!");
                    return;
                }
                
                db_users.push({ name, email, password: pass });
                localStorage.setItem("quizUsers", JSON.stringify(db_users));
                alert("Registered! Please Login.");
                location.reload();
            }
        });
    }

    // 5. LOGOUT BUTTON
    const btn_logout = document.getElementById("logoutBtn");
    if (btn_logout) {
        btn_logout.addEventListener("click", () => {
            if(confirm("Are you sure you want to logout?")) {
                localStorage.removeItem("quizCurrentUser");
                window.location.href = "login.html";
            }
        });
    }

    // 6. QUIZ FUNCTIONS (Create, List, Take)
    handleQuizLogic();
});

// --- HELPER FUNCTION ---
function handleQuizLogic() {
    let db_questions = JSON.parse(localStorage.getItem("quizData")) || [];

    // Create Quiz
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

    // List Quiz
    const listContainer = document.getElementById("quizListContainer");
    if (listContainer) {
        if (db_questions.length > 0) {
            listContainer.innerHTML = `
                <div class="quiz-card" style="background: white; padding: 20px; border-radius: 10px; margin-top:20px;">
                    <h3>🧠 General Quiz</h3>
                    <p>Total Questions: ${db_questions.length}</p>
                    <button onclick="window.location.href='quiz.html'" class="btn primary-btn" style="margin-top:10px">Start Quiz</button>
                </div>`;
        } else {
            listContainer.innerHTML = "<p>No quizzes available.</p>";
        }
    }

    // Take Quiz
    const quizBox = document.getElementById("quizContainer");
    if (quizBox) {
        let index = 0;
        let score = 0;
        let answers = [];

        if (db_questions.length === 0) {
            quizBox.innerHTML = "<h3>No quiz available.</h3><a href='index.html' class='btn secondary-btn'>Go Back</a>";
        } else {
            const showQuestion = () => {
                const q = db_questions[index];
                document.getElementById("quizQuestion").innerText = `${index + 1}. ${q.question}`;
                document.getElementById("textA").innerText = q.a;
                document.getElementById("textB").innerText = q.b;
                document.getElementById("textC").innerText = q.c;
                document.getElementById("textD").innerText = q.d;
            };
            showQuestion();

            document.getElementById("nextBtn").addEventListener("click", () => {
                const selected = document.querySelector('input[name="option"]:checked');
                if (!selected) { alert("Select an option!"); return; }
                
                answers.push(selected.value);
                if (selected.value === db_questions[index].correct) score++;
                
                index++;
                if (index < db_questions.length) {
                    showQuestion();
                    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
                } else {
                    localStorage.setItem("finalScore", score);
                    localStorage.setItem("totalQ", db_questions.length);
                    localStorage.setItem("myAnswers", JSON.stringify(answers));
                    window.location.href = "result.html";
                }
            });
        }
    }
    
    // Results
    const scoreText = document.getElementById("scoreText");
    if(scoreText) {
        scoreText.innerText = `You scored ${localStorage.getItem("finalScore")} / ${localStorage.getItem("totalQ")}`;
        document.getElementById("reviewBtn").addEventListener("click", () => {
             const myAns = JSON.parse(localStorage.getItem("myAnswers"));
             const reviewList = document.getElementById("reviewList");
             reviewList.style.display = "block";
             reviewList.innerHTML = "";
             db_questions.forEach((q, i) => {
                 reviewList.innerHTML += `<p><b>Q${i+1}:</b> ${q.question}<br>Your Ans: ${myAns[i]} (Correct: ${q.correct})</p><hr>`;
             });
        });
    }

    // Reset
    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if(confirm("Delete all data?")) {
                localStorage.clear();
                window.location.href = "login.html";
            }
        });
    }
}
