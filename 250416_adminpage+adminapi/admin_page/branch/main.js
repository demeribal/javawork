//--1. AJAX 탭 콘텐츠 로딩
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  // ✅ 탭 클릭 이벤트 바인딩
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 탭 active 토글
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // 콘텐츠 영역 토글
      tabContents.forEach((content) => content.classList.remove("active"));
      const tabName = tab.getAttribute("data-tab");
      document.getElementById(`${tabName}-content`).classList.add("active");

      // CSS/JS 동적 로딩
      loadTabAssets(tabName);

      // 해당 탭 HTML 불러오기 → 탭 내부 영역에 삽입
      fetch(`${tabName}.html`)
        .then((res) => res.text())
        .then((html) => {
          const targetArea = document.getElementById(`${tabName}-data-area`);
          if (targetArea) {
            targetArea.innerHTML = html;

          if (tabName === "menu" && typeof initPayPage === "function") {
            initPayPage();
          }
          // pay 탭일 때만 initPayPage 실행
          if (tabName === "pay" && typeof initPayPage === "function") {
            initPayPage();
          }
          //pay 탭일 때 데이터도 같이 로드
          if (tabName === "pay" && typeof fetchPayList === "function") {
            fetchPayList();
          }
          if (tabName === 'menu' && typeof initMenuPage === 'function') {
            initMenuPage();
          }
          }
        })
        .catch((err) => console.error(`${tabName} 탭 로딩 실패:`, err));
    });
  });

  // ✅ 초기 탭 로딩: stock
  const defaultTab = "stock";
  document.querySelector(`.tab[data-tab="${defaultTab}"]`).classList.add("active");
  document.getElementById(`${defaultTab}-content`).classList.add("active");

  loadTabAssets(defaultTab);
  fetch(`${defaultTab}.html`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById(`${defaultTab}-data-area`).innerHTML = html;
    })
    .catch((err) => console.error("초기 stock.html 로딩 실패:", err));
});

// ✅ 공통 CSS & JS 동적 로딩 함수
function loadTabAssets(tabName) {
  // CSS 로딩
/*
  const styleId = `${tabName}-style`;
  if (!document.getElementById(styleId)) {
    const link = document.createElement("link");
    link.id = styleId;
    link.rel = "stylesheet";
    link.href = `${tabName}.css`;
    document.head.appendChild(link);
  }
   */ 

  // JS 로딩
  const scriptId = `${tabName}-script`;
  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `${tabName}.js`;
    script.onload = () => {
      console.log(`${tabName}.js 로드 완료`);
      if (tabName === 'pay' && typeof fetchPayList === 'function') {
        fetchPayList(); // 초기 데이터 불러오기
      }
      if (tabName === "pay" && typeof initPayPage === "function") {
        initPayPage();
      }
      if (tabName === "menu" && typeof initMenuPage === "function") {
        setTimeout(() => {
          initMenuPage();
        }, 0);
      }
    };
    document.body.appendChild(script);
  }
}

//--2. 데이터 있을때 no-data hidden
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
      
      /*
      // Toggle visibility of no-data div based on data presence

      if (hasData) {
          noDataDiv.style.display = 'none';
      } else {
          noDataDiv.style.display = 'block';
      }
*/
  }

  
  // Initial check for data

  
//--3.부족한 줄만큼 빈 <tr> 자동 추가
fetch("stock.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("stock-data-area").innerHTML = data;

    // 활성화
    document.querySelector('.tab[data-tab="stock"]').classList.add('active');
    document.getElementById('stock-content').classList.add('active');

    //테이블 로딩 후 빈 행 추가
   // addEmptyRows();
  });


function addEmptyRows(tbodyId = 'pay-table-body', minRows = 11) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  const currentRows = tbody.querySelectorAll('tr').length;
  const emptyCount = minRows - currentRows;

  for (let i = 0; i < emptyCount; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="7">&nbsp;</td>`;
    tbody.appendChild(tr);
  }
}
