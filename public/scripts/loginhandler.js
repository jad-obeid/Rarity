function requestLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const login_data = { username: username, password: password };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(login_data),
  };

  fetch("/login", options);
}

function requestRegister() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const repeat_password = document.getElementById("repeat-password").value;
  const email = document.getElementById("reg-email").value;
  const fname = document.getElementById("firstname").value;
  const lname = document.getElementById("lastname").value;

  if (password == repeat_password) {
    const login_data = {firstname: fname, lastname:lname, email: email, username: username, password: password};
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(login_data),
    };

    fetch("/register", options);
  }
  else {
      window.alert("Passwords should match");
  }
}

function showRegister(){
    document.getElementById("register").style.display = "flex";
    document.getElementById("signup").style.display = "none";
    console.log("working");
}
