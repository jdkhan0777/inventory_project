const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginForm = document.getElementById("login-form");
// const submitButton = document.getElementById("submit-button");

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
    const res = await fetch("https://inventory-project-1-7e0u.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token); // SAVE TOKEN
      // alert("Login successful! Redirecting to dashboard...");
      window.location.href = "index.html";
    } else {
      alert(
        data.message ||
          "Login failed. Please check your credentials and try again.",
      );
    }
  } catch (err) {
    console.error("Error during login:", err);
    alert("An error occurred. Please try again.");
  }
});
