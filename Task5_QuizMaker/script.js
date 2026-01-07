/* =======================================================
   Project: Online Quiz Maker (Fixed & Safe Mode)
   Developer: Vaibhavi
   ======================================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. LOAD USER DATA
    let db_users = JSON.parse(localStorage.getItem("quizUsers")) || [];
    let current_user = localStorage.getItem("quizCurrentUser");

    // 2. IDENTIFY PAGE
    // We check if the 'authForm' exists to know if we are on the Login Page
    const authForm = document.getElementById("authForm");
    const isLoginPage = !!authForm; 

    // 3. REDIRECT LOGIC (The Safety Guard)
    // If you are NOT logged in AND NOT on the login page -> Go to Login
    if (!current_user && !isLoginPage) {
        window.location.href = "login.html";
    }

    // If you ARE logged in AND ARE on the login page -> Go to Dashboard
    if (current_user && isLoginPage) {
        window.location.href = "index.html";
    }

    // 4. LOGIN / REGISTER HANDLER
    if (authForm) {
        const toggleLink = document.getElementById("toggleLink");
        const formTitle = document.getElementById("formTitle");
        const nameField = document.getElementById("nameField");
        const submitBtn = document.getElementById("submitBtn");
        const toggleText = document.getElementById("toggleText");

        let isLoginMode = true;

        // Toggle between Login and Register
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

        // Handle Form Submit
        authForm.addEventListener("submit", (e) => {
            e.preventDefault(); // STOP the page from reloading
            
            const email = document.getElementById("email").value.trim();
            const pass = document.getElementById("password").value.trim();

            if (isLoginMode) {
                // --- LOGIN LOGIC ---
                const user = db_users.find(u => u.email === email && u.password === pass);
                if (user) {
                    localStorage.setItem("quizCurrentUser", user.name);
                    alert("Login Success!");
                    window.location.href = "index.html";
                } else {
                    alert("Invalid email or password!");
                }
            } else {
                // --- REGISTER LOGIC ---
                const name = document.getElementById("fullname").value.trim();
                if (!name || !email || !pass) {
                    alert("Please fill all fields!");
                    return;
                }
                if (db_users.find(u => u.email === email)) {
                    alert("User already exists!");
                    return;
                }
                
                db_users.push({ name, email, password: pass });
                localStorage.setItem("quizUsers", JSON.stringify(db_users));
                alert("Registered Successfully! Please Login.");
                
                // Switch to login view automatically
                toggleLink.click(); 
            }
        });
    }

    // 5. LOGOUT LOGIC
    const btn_logout = document.getElementById("logoutBtn");
    if (btn_logout) {
        btn_logout.addEventListener("click", () => {
            if(confirm("Are you sure you want to logout?")) {
                localStorage.removeItem("quizCurrentUser");
                window.location.href = "login.html";
            }
        });
    }

    // 6. WELCOME MESSAGE
    const txt_welcome = document.getElementById("welcomeMsg");
    if (txt_welcome && current_user) {
        txt_welcome.innerText = `Welcome, ${current_user}! 👋`;
    }
    
    // 7. QUIZ LOGIC (Create, List, Take)
    handleQuizLogic(); 
});

// --- HELPER FUNCTION FOR QUIZ LOGIC ---
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
                <div class="quiz-card" style="background: white; padding: 20px; border-radius: 15px; border-left: 5px solid #0072ff;">
                    <h3>🧠 General Knowledge Quiz</h3>
                    <p>Total Questions: ${db_questions.length}</p>
                    <a href="quiz.html" class="btn primary-btn" style="margin-top:10px;">Start Quiz</a>
                </div>`;
        } else {
            listContainer.innerHTML = "<p>No quizzes found. Create one first!</p>";
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
    
    // Result Logic
    const scoreText = document.getElementById("scoreText");
    if(scoreText) {
        scoreText.innerText = `You scored ${localStorage.getItem("finalScore")} / ${localStorage.getItem("totalQ")}`;
        
        document.getElementById("reviewBtn").addEventListener("click", () => {
             const myAns = JSON.parse(localStorage.getItem("myAnswers"));
             const reviewList = document.getElementById("reviewList");
             reviewList.style.display = "block";
             reviewList.innerHTML = "";
             db_questions.forEach((q, i) => {
                 reviewList.innerHTML += `
                    <div class="review-item" style="border-left: 5px solid ${q.correct === myAns[i] ? 'green' : 'red'}; background: #fff; padding: 10px; margin: 5px 0;">
                        <p><b>Q${i+1}:</b> ${q.question}</p>
                        <p>Ans: ${myAns[i]} (Correct: ${q.correct})</p>
                    </div>`;
             });
        });
    }

    // Clear Data
    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (confirm("Delete all data?")) {
                localStorage.clear();
                window.location.href = "login.html";
            }
        });
    }
}