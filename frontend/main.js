// const baseUrl = "http://localhost:3000/api/v1"
const baseUrl = "https://easymart-gap9.onrender.com/api/v1"
const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("passwd");
const passwordRepeatInput = document.getElementById("passwd-repeat");
const togglePassword = document.getElementById("p-icon");
const toggleRepeatPassword = document.getElementById("pr-icon");
// const passwordInput = document.querySelector(".passwrd");

const signUp = (userData) => {
    axios
        .post(`${baseUrl}/user/signup`, userData)
        .then(function (response) {
            Swal.fire({
                toast: true,
                icon: "success",
                title: "Signup successful, login to start shopping",
                animation: false,
                position: "center",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });

        })
        .catch((err) => {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error Processing Input",
                text: err.response.data.message,
            });
        });
};

const signup = document.getElementById("signup-btn");
signup.addEventListener("click", () => {
    const fullName = fullnameInput.value;
    const email = emailInput.value;
    const phoneNumber = phoneInput.value;
    const password = passwordInput.value;
    const passwordRepeat = passwordRepeatInput.value;

    if (password !== passwordRepeat) {
        Swal.fire({
            title: "Password Error",
            text: "Passwords do not match!",
            icon: "error",
        });
    } else {
        const formData = {
            fullName,
            email,
            password,
            phoneNumber
        }
        signUp(formData);
    }
});


togglePassword.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }
});
toggleRepeatPassword.addEventListener("click", function () {
    if (passwordRepeatInput.type === "password") {
        passwordRepeatInput.type = "text";
        toggleRepeatPassword.classList.remove("fa-eye");
        toggleRepeatPassword.classList.add("fa-eye-slash");
    } else {
        passwordRepeatInput.type = "password";
        toggleRepeatPassword.classList.remove("fa-eye-slash");
        toggleRepeatPassword.classList.add("fa-eye");
    }
});
