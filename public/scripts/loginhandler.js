function requestRegister() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const repeat_password = document.getElementById("repeat-password").value;
  const email = document.getElementById("reg-email").value;
  const fname = document.getElementById("firstname").value;
  const lname = document.getElementById("lastname").value;

  let valid = true;

  if (fname == "") {
    $("#firstNameValidation").css("display", "block");
    valid = false;
  }

  else {
    $("#firstNameValidation").css("display", "none");
  }

  if (lname == "") {
    $("#lastNameValidation").css("display", "block");
    valid = false;
  }
  else {
    $("#lastNameValidation").css("display", "none");
  }

  if (username == "") {
    $("#usernameValidation").css("display", "block");
    valid = false;
  }

  else {
    $("#usernameValidation").css("display", "none");
  }

  if (email == "") {
    $("#emailValidation").css("display", "block");
    valid = false;
  }

  else {
    $("#emailValidation").css("display", "none");
  }

  if (password == "") {
    $("#passwordValidation").css("display", "block");
    valid = false;
  }

  else {
    $("#passwordValidation").css("display", "none");
  }

  if (password != repeat_password || repeat_password == '') {
    $("#passwordConfirmValidation").css("display", "block");
    valid = false;
  }

  if (!valid) {
    return;
  }

  const login_data = { firstname: fname, lastname: lname, email: email, username: username, password: password };

  fetch('/getAllUsers', {
    method: 'GET',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
  })
    .then(res => res.json())
    .then(res => {
      console.log("retrieved all users!!! ", res);
      for (user of res) {
        if (user.username == login_data.username) {
          console.log("Username already Exists!!!!");
          $("#usernameValidation").css("display", "block");
          $("#usernameValidation").html("Username already exists!");
          return;
        }
      }

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(login_data),
      };

      fetch("/register", options)
        .then(res => res.json)
        .then(res => {
          console.log("Successfully saved user", res);
        })
        .catch(e => {
          console.log("Failed to register", e);
        })
      document.getElementById("register").style.display = "none";
    })
    .catch(e => {
      console.log("Failed to register user ====>", e);
    });
}

function ConfirmPassowrd() {
  let password = $("#reg-password").val();
  let confirmPassword = $("#repeat-password").val();

  console.log("passworddddddddd1 ", password);
  console.log("passworddddddddd2 ", confirmPassword);

  if (password != confirmPassword) {
    console.log("true?");
    $("#passwordConfirmValidation").html("Passwords do not match!");
    $("#passwordConfirmValidation").css("display", "block");
  }

  else {
    $("#passwordConfirmValidation").html("");
    $("#passwordConfirmValidation").css("display", "none");
  }
}

function showRegister() {
  document.getElementById("register").style.display = "flex";
  document.getElementById("signup").style.display = "none";
  console.log("working");
}

function EmailRegex() {
  let regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  let emailVal = document.getElementById("reg-email").value;

  console.log(emailVal)

  if (!emailVal.toLowerCase().match(regexEmail)) {
    $("#emailValidation").css("display", "block");
    $("#emailValidation").html("This email is not valid!");
  }

  else {
    $("#emailValidation").css("display", "none");
  }
}