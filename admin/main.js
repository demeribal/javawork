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

        if (tabName === 'stock') {
          fetch(`${tabName}.html`)
            .then(response => response.text())
            .then(data => {
              document.getElementById("stock-data-area").innerHTML = data;
        
              // 필요하면 stock.js 스크립트 삽입
            })
            .catch(error => console.error("Stock 탭 로딩 실패:", error));
        }
      });
    });
  });

//첫 화면 로딩 시 바로 화면 표출
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

      if (tabName === 'pay') {
        fetch(`${tabName}.html`)
          .then(response => response.text())
          .then(data => {
            document.getElementById("pay-data-area").innerHTML = data;
          })
          .catch(error => console.error("Pay 탭 로딩 실패:", error));
      }

      if (tabName === 'stock') {
        fetch(`${tabName}.html`)
          .then(response => response.text())
          .then(data => {
            document.getElementById("stock-data-area").innerHTML = data;
          })
          .catch(error => console.error("Stock 탭 로딩 실패:", error));
      }

      if (tabName === 'menu') {
        fetch(`${tabName}.html`)
          .then(response => response.text())
          .then(data => {
            document.getElementById("menu-data-area").innerHTML = data;
          })
          .catch(error => console.error("menu 탭 로딩 실패:", error));
      }
    });
  });

  // 초기 로딩 시 stock.html 불러오기
  fetch("stock.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("stock-data-area").innerHTML = data;
    })
    .catch(error => console.error("초기 Stock 로딩 실패:", error));
});


// 데이터 있을때 no-data hidden
  const noDataDiv = document.querySelector('.no-data');
  const showDataBtn = document.getElementById('showDataBtn');
  const hideDataBtn = document.getElementById('hideDataBtn');
  const tableBody = document.getElementById('orderTableBody');
  
  function checkForData() {
      let hasData = false;
      const orderRows = document.querySelectorAll('tr.order');
      
      orderRows.forEach(row => {
          // Check if row has any non-empty cells
          const cells = row.querySelectorAll('td');
          for (let i = 0; i < cells.length; i++) {
              const cellContent = cells[i].textContent.trim();
              if (cellContent !== '') {
                  hasData = true;
                  break;
              }
          }
      });
      
      // Toggle visibility of no-data div based on data presence
      if (hasData) {
          noDataDiv.style.display = 'none';
      } else {
          noDataDiv.style.display = 'block';
      }
  }
  
  // Initial check for data
  checkForData();

//부족한 줄만큼 빈 <tr> 자동 추가
fetch("stock.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("stock-data-area").innerHTML = data;

    // 활성화
    document.querySelector('.tab[data-tab="stock"]').classList.add('active');
    document.getElementById('stock-content').classList.add('active');

    // ✅ 테이블 로딩 후 빈 행 추가
    addEmptyRows();
  });

