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

      // 해당 탭 HTML 불러오기 → 탭 내부 영역에 삽입
      fetch(`${tabName}.html`)
      .then((res) => res.text())
      .then((html) => {
        const targetArea = document.getElementById(`${tabName}-data-area`);
        if (targetArea) {
          targetArea.innerHTML = html;
    
          loadTabAssets(tabName, () => {
            if (tabName === 'pay') {
              if (typeof window.initPayPage === 'function') {
                window.initPayPage();
              }
              /**/
              if (typeof window.fetchPayList === 'function') {
                window.fetchPayList();
              }
                
            }
            if (tabName === 'stock') {
              if (typeof window.fetchOrderList === 'function') {
                window.fetchOrderList();
              }
            }
          });
        }
      })
      .catch((err) => console.error(`${tabName} 탭 로딩 실패:`, err));
  });
});

  // ✅ 초기 탭 로딩: stock
  const defaultTab = "stock";
  document.querySelector(`.tab[data-tab="${defaultTab}"]`).classList.add("active");
  document.getElementById(`${defaultTab}-content`).classList.add("active");

  // 여기에서 직접 초기 HTML 로드와 스크립트 로딩을 처리
  fetch(`${defaultTab}.html`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById(`${defaultTab}-data-area`).innerHTML = html;
      
      // CSS & JS 한 번만 로드
      loadTabAssets(defaultTab, () => {
        if (typeof window.fetchOrderList === 'function') {
          window.fetchOrderList();
        }
      });
    })
    .catch((err) => console.error("초기 stock.html 로딩 실패:", err));
});

// ✅ 공통 CSS & JS 동적 로딩 함수
function loadTabAssets(tabName, callback) {
    // 1. 월/일 모달은 항상 제거 (flatpickr 모달)
    ['month-modal', 'day-modal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    // 2. date-modal, date-modal-dim은 삭제 ❌ → 숨기기만
    if (tabName !== 'pay') {
      const dim = document.getElementById('date-modal-dim');
      const modal = document.getElementById('date-modal');
      if (dim) dim.style.display = 'none';
      if (modal) modal.style.display = 'none';
    }

    // 기존 css 제거
    document.querySelectorAll("link[data-tab-css]").forEach(link => link.remove());

    //js 제거 및 기존 전역함수 제거
    const existingScript = document.getElementById('tab-script');
    if (existingScript) {
      existingScript.parentNode.removeChild(existingScript);
      ['initPayPage', 'fetchPayList', 'fetchOrderList'].forEach(fn => {
        if (window[fn]) delete window[fn];
      });  
    }

    // CSS 로딩
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${tabName}.css`;
    link.setAttribute("data-tab-css", tabName);
    document.head.appendChild(link);


//pay탭에서만 달력 로딩
if (tabName === 'pay') {
  // flatpickr CSS
  const flatpickrCSS = document.createElement('link');
  flatpickrCSS.rel = 'stylesheet';
  flatpickrCSS.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
  document.head.appendChild(flatpickrCSS);

  const monthCSS = document.createElement('link');
  monthCSS.rel = 'stylesheet';
  monthCSS.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/plugins/monthSelect/style.css';
  document.head.appendChild(monthCSS);

  // flatpickr JS → 순차 로딩 필요
  const flatpickrJS = document.createElement('script');
  flatpickrJS.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
  flatpickrJS.onload = () => {
    const pluginJS = document.createElement('script');
    pluginJS.src = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/plugins/monthSelect/index.js';
    pluginJS.onload = () => {
      const langJS = document.createElement('script');
      langJS.src = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/ko.js';
      langJS.onload = () => {
      loadTabScript(tabName, callback); // pay.js 로드
    };
    document.body.appendChild(langJS);
  };
  document.body.appendChild(pluginJS);
};
document.body.appendChild(flatpickrJS);

} else {
  // 다른 탭은 기존처럼 바로 js 로드
  loadTabScript(tabName, callback);
}
}

//JS 로드
function loadTabScript(tabName, callback) {
  setTimeout(() => {
    const script = document.createElement('script');
    script.id = 'tab-script';
    script.src = `${tabName}.js`;

    script.onload = () => {
      console.log(`${tabName}.js 로드 완료`);
      setTimeout(() => {
        if (typeof callback === 'function') {
          console.log(`${tabName} 탭의 콜백 함수 실행`);
          setTimeout(() => callback(), 50);
        }
      }, 50);
    };

    document.body.appendChild(script);
  }, 100);
}


// 통합된 행 추가 함수 - 이전의 빈 행 추가 기능도 포함
window.addEmptyRows = function(tbodyId, minRows = 11) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  // ✅ 현재 보이는 행만 count (display !== 'none')
  const visibleRows = Array.from(tbody.querySelectorAll('tr.order:not(.empty-row)'))
    .filter(row => row.style.display !== 'none');

  const emptyCount = minRows - visibleRows.length;

  // 기존 empty-row 제거
  tbody.querySelectorAll('.empty-row').forEach(row => row.remove());


  for (let i = 0; i < emptyCount; i++) {
    const tr = document.createElement('tr');
    tr.classList.add('empty-row');
    tr.innerHTML = `<td colspan="7">&nbsp;</td>`;
    tbody.appendChild(tr);
  }
};


// 데이터 존재 여부 확인 함수 개선
function checkForData(tableSelector, noDataSelector) {
  const table = document.querySelector(tableSelector);
  const noData = document.querySelector(noDataSelector);
  
  if (!table || !noData) return;
  
  const visibleRows = Array.from(table.querySelectorAll('tr.order:not(.empty-row)'))
    .filter(row => row.style.display !== 'none');
  
  const hasData = visibleRows.length > 0;

  noData.classList.toggle('hidden', hasData);
}

/*
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
  }
*/
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

/*
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
  */