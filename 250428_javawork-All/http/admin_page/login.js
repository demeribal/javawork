document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const encodedPassword = btoa(password); // Base64 인코딩

    fetch("http://localhost:8080/api/user/login", { 
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            username, 
            password: encodedPassword  // 인코딩된 비밀번호 전송
        })
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
        } else {
            alert("로그인 실패");
        }
    })
    .catch(error => {
        console.error("로그인 중 오류 발생:", error);
    });
});
