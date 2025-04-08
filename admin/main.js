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


  
// 지점 선택 가능

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

// const branchButtons = document.querySelectorAll('.branch-btn'); 위에 이미 있음
document.addEventListener('DOMContentLoaded', () => {
const orderRows = document.querySelectorAll('tr.order');
const noDataMessage = document.querySelector('.no-data');

// Set the "All branches" button as active by default
document.querySelector('.branch-btn[data-branch="all"]').classList.add('active');

// Function to filter table by branch
function filterTableByBranch(branchName) {
let visibleRowCount = 0;

// Process each row
orderRows.forEach(row => {
// Skip empty rows
if (row.classList.contains('empty-row')) return;

// Get this row's branch name
const rowBranch = row.getAttribute('data-branch');

// Show or hide based on selected branch
if (branchName === 'all' || rowBranch === branchName) {
row.style.display = '';
visibleRowCount++;
} else {
row.style.display = 'none';
}
});

// Show/hide no-data message based on visible rows
if (visibleRowCount === 0) {
noDataMessage.classList.remove('hidden');
} else {
noDataMessage.classList.add('hidden');
}
}

// Add click event for branch buttons
branchButtons.forEach(button => {
button.addEventListener('click', function() {
// Remove active class from all buttons
branchButtons.forEach(btn => btn.classList.remove('active'));

// Add active class to clicked button
this.classList.add('active');

// Filter table based on selected branch
const branchName = this.getAttribute('data-branch');
filterTableByBranch(branchName);
});
});

// Initialize the table to show all branches
filterTableByBranch('all');
});
  

// 드롭다운의 기본값 설정 및 변경 이벤트 처리(재고)
document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown-container-stock');

  dropdowns.forEach(dropdown => {
      const button = dropdown.querySelector('.dropdown-button-stock');
      const options = dropdown.querySelectorAll('.dropdown-options-stock li');

      // 드롭다운 열고 닫기
      button.addEventListener('click', (e) => {
          e.stopPropagation(); // 이벤트 버블링 방지
          dropdown.classList.toggle('open');
      });

      // 옵션 선택 처리
      options.forEach(option => {
          option.addEventListener('click', () => {
              const selectedValue = option.textContent; // 선택된 텍스트 가져오기
              button.textContent = selectedValue; // 버튼 텍스트 변경
              dropdown.classList.remove('open'); // 드롭다운 닫기

              // 선택된 값 저장 (localStorage)
              localStorage.setItem('productStatus', selectedValue);
              console.log(`선택된 상태: ${selectedValue}`); // 선택된 값 출력
          });
      });

      // 드롭다운 외부 클릭 시 닫기
      window.addEventListener('click', (e) => {
          if (!dropdown.contains(e.target)) {
              dropdown.classList.remove('open');
          }
      });

      // 페이지 로드 시, 저장된 상태를 불러오기 (localStorage)
      const savedStatus = localStorage.getItem('productStatus');
      if (savedStatus && button.textContent !== savedStatus) {
          button.textContent = savedStatus; // 저장된 값으로 버튼 텍스트 설정
      }
  });
});
