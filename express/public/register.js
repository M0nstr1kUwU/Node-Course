async function login() {
    const login = document.getElementById("login");
    const password = document.getElementById("password");
    
    const res =  await fetch("/api/login", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({password: password, login: login}),
    });
    
    const data = await res.json();
    
    if (data.status === "success") {
        window.location.href = "/dashboard";
    }
    if (data.status === "error") {
        window.location.href = "/error";
    }
    
    
}