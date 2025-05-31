document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitLink').addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent the default anchor behavior

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                const message = await response.text();
                alert(message); // Show success message
                window.location.href = 'main.html'
            } else {
                const errorMessage = await response.text();
                document.getElementById('errorMessage').innerText = 'Error: ' + errorMessage; // Show error message
            }
        } catch (error) {
            document.getElementById('errorMessage').innerText = 'Error: ' + error.message; // Handle network errors
        }
    });

    document
        .getElementById("loginBtn")
        .addEventListener("click", async (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            const response = await fetch("/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Login successful!");
                window.location.href = "main.html";
            } else {
                document.getElementById("errorMessage").textContent = data.error;
            }
    });
});

function toggleCards() {
        const signupCard = document.getElementById('signupcard');
        const loginCard = document.getElementById('logincard');

        signupCard.classList.toggle('active');
        loginCard.classList.toggle('active');
    };