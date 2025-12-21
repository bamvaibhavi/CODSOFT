/* =======================================================
   Project: Online Quiz Maker (NO REDIRECTS - OPEN MODE)
   ======================================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. GET USER
    let current_user = localStorage.getItem("quizCurrentUser");
    
    // 2. CHECK PAGE
    const authForm = document.getElementById("authForm"); // Exists only on Login Page
    const welcomeMsg = document.getElementById("welcomeMsg"); // Exists on Dashboard

    // -----------------------------------------------------------
    // 🛑 I DELETED THE SECURITY CHECK. NO MORE KICKING OUT! 🛑
    // -----------------------------------------------------------

    // 3. IF ON DASHBOARD (Index.html)
    if (welcomeMsg) {
        if (current_user) {
            welcomeMsg.innerText = `Welcome, ${current_user}! 👋`;
        } else {
            // If storage failed, just show a generic welcome instead of kicking out
            welcomeMsg.innerText = "Welcome, Student! 🎓";
        }
    }

    // 4. LOGIN FORM LOGIC
    if (authForm) {
        const toggleLink = document.getElementById("toggleLink");
        const formTitle = document.getElementById("formTitle");
        const submitBtn = document.getElementById("submitBtn");
        const nameField = document.getElementById("nameField");
        const toggleText = document.getElementById("toggleText");

        let isLoginMode = true;

        // Toggle Logic
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

        // Submit Logic
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let db_users = JSON.parse(localStorage.getItem("quizUsers")) || [];
            const email = document.getElementById("email").value.trim();
            const pass = document.getElementById("password").value.trim();

            if (isLoginMode) {
                // Login
                const user = db_users.find(u => u.email === email && u.password === pass);
                if (user) {
                    localStorage.setItem("quizCurrentUser", user.name);
                    // DIRECT JUMP
                    window.location.href = "index.html";
                } else {
                    alert("Invalid details");
                }
            } else {
                // Register
                const name = document.getElementById("fullname").value.trim();
                db_users.push({ name, email, password: pass });
                localStorage.setItem("quizUsers", JSON.stringify(db_users));
                alert("Registered! Please Login.");
                location.reload();
            }
        });
    }

    // 5. LOGOUT LOGIC
    const btn_logout = document.getElementById("logoutBtn");
    if (btn_logout) {
        btn_logout.addEventListener("click", () => {
            if(confirm("Logout?")) {
                localStorage.removeItem("quizCurrentUser");
                window.location.href = "login.html";
            }
        });
    }

    // 6. QUIZ LOGIC (Create & Take)
    handleQuizLogic();
});

// Helper Function
function handleQuizLogic() {
    let db_questions = JSON.parse(localStorage.getItem("quizData")) || [];

    // Create
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
            alert("Saved!");
            form_create.reset();
        });
    }

    // List
    const listContainer = document.getElementById("quizListContainer");
    if (listContainer) {
        if (db_questions.length > 0) {
            listContainer.innerHTML = `
                <div class="quiz-card" style="background: white; padding: 20px; border-radius: 10px;">
                    <h3>General Quiz</h3>
                    <p>Total Questions: ${db_questions.length}</p>
                    <button onclick="window.location.href='quiz.html'" class="btn primary-btn">Start Quiz</button>
                </div>`;
        } else {
            listContainer.innerHTML = "<p>No quizzes yet.</p>";
        }
    }

    // Take Quiz
    const quizBox = document.getElementById("quizContainer");
    if (quizBox) {
        let index = 0;
        let score = 0;
        let answers = [];

        if (db_questions.length === 0) {
            quizBox.innerHTML = "<h3>No quiz available.</h3>";
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
                if (!selected) { alert("Select option!"); return; }
                
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

    // Result
    const scoreText = document.getElementById("scoreText");
    if(scoreText) {
        scoreText.innerText = `Score: ${localStorage.getItem("finalScore")} / ${localStorage.getItem("totalQ")}`;
        document.getElementById("reviewBtn").addEventListener("click", () => {
             const myAns = JSON.parse(localStorage.getItem("myAnswers"));
             const reviewList = document.getElementById("reviewList");
             reviewList.style.display = "block";
             reviewList.innerHTML = "";
             db_questions.forEach((q, i) => {
                 reviewList.innerHTML += `<p>Q${i+1}: ${q.question} <br> <b>Ans: ${myAns[i]}</b> (Correct: ${q.correct})</p><hr>`;
             });
        });
    }

    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "login.html";
        });
    }
}
