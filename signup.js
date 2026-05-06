const name = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const signupForm = document.getElementById("signups");


signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (password.value !== confirmPassword.value) {
    alert("password do not match");
    return;
  }

  try {
    const res = await fetch("https://inventory-project-1-7e0u.onrender.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    });
    const data = await res.json();

    if(res.ok) {
        alert("Signup successful! Please log in.");
        window.location.href = "login.html";
        return;
    } else {
        alert(data.message || "Signup failed. Please try again.");
    }
  } catch (err) {
    console.error("Error during signup:", err);
    alert("An error occurred. Please try again.");
  }
});
