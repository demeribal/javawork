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
              if (typeof window.fetchStockList === 'function') {
                window.fetchStockList();
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
        if (typeof window.fetchStockList === 'function') {
          window.fetchStockList();
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
      ['initPayPage', 'fetchPayList', 'fetchStockList'].forEach(fn => {
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


  for (let i = 0; i < emptyCount-1.8; i++) {
    const tr = document.createElement('tr');
    tr.classList.add('empty-row');
    tr.innerHTML = `<td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>`;
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
  */






// 필터 모달 토글 기능
document.addEventListener("DOMContentLoaded", () => {
  // 필터 버튼과 모달 요소 선택
  const filterBtn = document.querySelector(".filter-btn");
  const filterModal = document.querySelector(".filter-modal");
  const closeFilterBtn = document.querySelector(".close-filter");
  const applyFilterBtn = document.getElementById("apply-filter");
  const resetFilterBtn = document.getElementById("reset-filter");
  
  // 필터 버튼 클릭 시 모달 표시/숨김
  if (filterBtn && filterModal) {
    filterBtn.addEventListener("click", () => {
      filterModal.classList.toggle("hidden");
    });
  }
  
  // 닫기 버튼 클릭 시 모달 숨김
  if (closeFilterBtn && filterModal) {
    closeFilterBtn.addEventListener("click", () => {
      filterModal.classList.add("hidden");
    });
  }
  
  // 모달 외부 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!filterModal.contains(e.target) && e.target !== filterBtn) {
      filterModal.classList.add("hidden");
    }
  });

  // 실시간 검색 기능 구현
  const realTimeSearch = document.getElementById("real-time-search");
  if (realTimeSearch) {
    realTimeSearch.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      // 모든 주문 행 가져오기 (기존 행 보존)
      const orderRows = document.querySelectorAll("tr.order");
      
      // 1. 검색 필터링
      orderRows.forEach(row => {
        const menuName = row.querySelector("td:nth-child(3)")?.textContent.toLowerCase() || "";
        row.style.display = menuName.includes(searchTerm) ? "" : "none";
      });

      // 2. 빈 행 추가 (항상 10개 유지)
      if (typeof window.addEmptyRows === "function") {
        window.addEmptyRows("stock-table-body", 10); // 두 번째 인자로 최소 행 수 지정
      }

      // 3. 검색 결과 없음 메시지 처리
      const visibleRows = Array.from(orderRows).filter(row => 
        row.style.display !== "none" && !row.classList.contains("empty-row")
      );
      //document.getElementById("no-result").style.display = 
        //visibleRows.length > 0 ? "none" : "block";
    });
  }
  
  // 필터 적용 버튼 클릭 시
  if (applyFilterBtn) {
    applyFilterBtn.addEventListener("click", () => {
      const noFilter = document.getElementById("filter-no").value;
      //const branchFilter = document.getElementById("filter-branch").value;
      const menuFilter = document.getElementById("filter-menu").value.toLowerCase();
      
      // 모든 주문 행에 필터 적용
      const orderRows = document.querySelectorAll("tr.order");
      let hasVisibleRows = false;
      
      orderRows.forEach(row => {
        const rowNo = row.querySelector("td:nth-child(1)")?.textContent || "";
        //const rowBranch = row.getAttribute("data-branch") || "";
        const rowMenu = row.querySelector("td:nth-child(3)")?.textContent.toLowerCase() || "";
        
        const noMatch = !noFilter || rowNo.includes(noFilter);
        //const branchMatch = !branchFilter || rowBranch === branchFilter;
        const menuMatch = !menuFilter || rowMenu.includes(menuFilter);
        
        //if (noMatch && branchMatch && menuMatch) {
        if (noMatch && menuMatch) {
          row.style.display = "";
          hasVisibleRows = true;
        } else {
          row.style.display = "none";
        }
      });
      
      // 검색 결과 없음 메시지 표시/숨김
      const noResult = document.getElementById("no-result");
      if (noResult) {
        noResult.style.display = hasVisibleRows ? "none" : "block";
      }
      
      // 빈 행 추가 함수 호출 (필요한 경우)
      if (typeof window.addEmptyRows === "function") {
        window.addEmptyRows("stock-table-body"); // 테이블 본문 ID에 맞게 수정
      }
      
      // 필터 모달 닫기
      filterModal.classList.add("hidden");
    });
  }
  
  // 필터 초기화 버튼 클릭 시
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", () => {
      document.getElementById("filter-no").value = "";
      //document.getElementById("filter-branch").value = "";
      document.getElementById("filter-menu").value = "";
      
      // 모든 행 표시
      const orderRows = document.querySelectorAll("tr.order");
      orderRows.forEach(row => {
        row.style.display = "";
      });
      
      // 검색 결과 없음 메시지 숨김
      const noResult = document.getElementById("no-result");
      if (noResult) {
        noResult.style.display = "none";
      }
      
      // 빈 행 추가 함수 호출 (필요한 경우)
      if (typeof window.addEmptyRows === "function") {
        window.addEmptyRows("stock-table-body"); // 테이블 본문 ID에 맞게 수정
      }
    });
  }
});