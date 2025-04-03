document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://192.168.50.15:8080/api/login", {  // 백엔드 주소로 요청
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "로그인 성공") {
            alert("로그인 성공!");
            // 로그인 후 이동할 페이지 설정
            window.location.href = "main.html";
        } else {
            alert("로그인 실패. 아이디와 비밀번호를 확인하세요.");
        }
    })
    .catch(error => console.error("Error:", error));
});
