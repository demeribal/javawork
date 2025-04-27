document.addEventListener("DOMContentLoaded", function() {
  const exitButton = document.getElementById('exit-button');
  
  // exit-button이 있는 페이지에서만 이벤트 리스너 추가
  if (exitButton) {
    exitButton.addEventListener('click', function(event) {
      event.preventDefault();
      sessionStorage.clear();
      window.location.href = '/index.html'; 
    });
  }
});

// favicon 추가 (모든 페이지에서 실행)
(function() {
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = "/images/BR_favicon.png";
favicon.type = "image/png";
document.head.appendChild(favicon);
})();