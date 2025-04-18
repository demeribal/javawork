function onSubmit() {
    const token = grecaptcha.getResponse();  // 리캡챠 토큰을 가져옴
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (token === "") {
        alert("사람 인증을 진행해주세요.");
        return;
    }
console.log("리캡챠 토큰: " + token);

    fetch("http://192.168.0.17:8080/api/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, recaptchaToken: token })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "로그인 성공") {
            alert("로그인 성공!");
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
}
