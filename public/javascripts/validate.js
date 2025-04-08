//used to login
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#register-form");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirm_password");
  //const errorMessage = document.querySelector("#error-message");

  form.addEventListener("submit", function (event) {
    console.log("validate.js is loaded");
    if (password.value !== confirmPassword.value) {
      event.preventDefault();
      alert("Passwords do not match.");

      confirmPassword.style.color = "red";
    }
  });
});
