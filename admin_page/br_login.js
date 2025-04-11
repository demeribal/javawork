document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

<<<<<<< Updated upstream
    fetch("http://127.0.0.1:8080/user/login", { 
=======
    fetch("http://192.168.0.17:8080/api/login", {  // 백엔드 주소로 요청
>>>>>>> Stashed changes
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

            // 로그인 성공했으니 바로 user/info 요청
            fetch('http://127.0.0.1:8080/office/api/info', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Accept": "application/json"
                }
            })
            .then(response => response.json())
            .then(infoData => {
                console.log("User Info:", infoData); 
                // infoData를 필요하면 localStorage 등에 저장해둘 수도 있음

                // infoData로 분기 처리
                if (infoData.head) {  // 여긴 infoData.head로 확인해야 함 (data.isHead 아님!)
                    window.location.href = "admin_main.html";
                } else {
                    window.location.href = "user_main.html";
                }
            })
            .catch(error => {
                console.error("User Info Error:", error);
                alert("로그인은 되었지만 사용자 정보를 가져오는 데 실패했습니다.");
            });

        } else {
            alert("로그인 실패. 아이디와 비밀번호를 확인하세요.");
        }
    })    
    .catch(error => {
        console.error("Login Error:", error);
        alert("서버 에러 발생. 잠시 후 다시 시도해주세요.");
    });
});
