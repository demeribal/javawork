document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    fetch("http://tomhoon.duckdns.org:8882/api/user/login", { 
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "로그인 성공") {
            alert("로그인 성공!");
            // infoData로 분기 처리
            if (data.isHead === true) { 
                window.location.href = "head/main.html";
            } else {
                window.location.href = "branch/main.html";
            }
    }})
            
});
