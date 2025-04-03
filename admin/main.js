 // 탭 전환 기능
 const tabs = document.querySelectorAll('.tab');
 const tabContents = document.querySelectorAll('.tab-content');
 
 tabs.forEach(tab => {
     tab.addEventListener('click', () => {
         // 모든 탭에서 active 클래스 제거
         tabs.forEach(t => t.classList.remove('active'));
         
         // 클릭한 탭에 active 클래스 추가
         tab.classList.add('active');
         
         // 모든 콘텐츠 영역에서 active 클래스 제거
         tabContents.forEach(content => content.classList.remove('active'));
         
         // 클릭한 탭에 해당하는 콘텐츠 영역 활성화
         const tabName = tab.getAttribute('data-tab');
         document.getElementById(`${tabName}-content`).classList.add('active');
     });
 });
 
 // 지점 필터 버튼 기능
 const branchButtons = document.querySelectorAll('.branch-btn');
 
 branchButtons.forEach(button => {
     button.addEventListener('click', () => {
         // 버튼의 active 상태 토글
         button.classList.toggle('active');
         
         // 활성화된 지점 필터 확인
         const activeBranches = [];
         document.querySelectorAll('.branch-btn.active').forEach(btn => {
             activeBranches.push(btn.getAttribute('data-branch'));
         });
         
         // 여기서 필터링된 데이터를 표시하는 로직을 추가할 수 있습니다
         console.log('활성화된 지점:', activeBranches);
     });
 });


//AJAX
// 탭 전환 기능
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
  
        tabContents.forEach(content => content.classList.remove('active'));
  
        const tabName = tab.getAttribute('data-tab');
        const contentDiv = document.getElementById(`${tabName}-content`);
        contentDiv.classList.add('active');
  
        // PAY만 AJAX로 하단 테이블만 로드
        if (tabName === 'pay') {
          fetch(`${tabName}.html`)
            .then(response => response.text())
            .then(data => {
              document.getElementById("pay-data-area").innerHTML = data;
            })
            .catch(error => console.error("탭 로딩 실패:", error));
        }
      });
    });
  });

  