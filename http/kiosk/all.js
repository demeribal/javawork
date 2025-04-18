document.addEventListener("DOMContentLoaded", function() {
    const exitButton = document.getElementById('exit-button');
  
    // "exit-button" 클릭 시 동작
    exitButton.addEventListener('click', function(event) {
      event.preventDefault();  // 링크의 기본 동작을 막음 (페이지 이동 방지)
  
      // 세션 스토리지 초기화 (세션 데이터 삭제)
      sessionStorage.clear();
  
      // 첫 화면으로 돌아가기
      window.location.href = '../../index.html'; 
    });
  });

  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = "../../images/BR_favicon.png";
  favicon.type = "image/png";
  document.head.appendChild(favicon);