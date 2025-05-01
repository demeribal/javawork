
window.initPayPage = initPayPage;
window.fetchPayList = fetchPayList;

let currentOrder = 'desc'; // 실제 적용된 정렬 값
let tempOrder = ''; 
let calendarIconListeners = [];
  
  function initPayPage() {
  // DOM 요소 참조
  const dateBtn = document.getElementById('date-btn');
  const dim = document.getElementById('date-modal-dim');
  const modal = document.getElementById('date-modal');
  const todayBtn = document.getElementById('today-btn');
  const resetBtn = document.getElementById('reset-btn');
  const applyBtn = document.getElementById('apply-btn');
  const fromInput = document.getElementById('from-date');
  const toInput = document.getElementById('to-date');
  const selected = document.getElementById("sort-selected");
  const options = document.getElementById("sort-options");
  
  if (dateBtn && dim && modal) {
    dateBtn.addEventListener('click', () => {
      dim.style.display = 'block';
      modal.style.display = 'block';
    });
  }

  //from 날짜 선택 전 to 날짜 선택 비활성화
  toInput.disabled = true;
  toInput.setAttribute('data-disabled', 'true');

  //from 날짜 선택 후 to 날짜 선택 활성화
  fromInput.addEventListener('change', () => {
  if (fromInput.value) {
    toInput.disabled = false;
    toInput.classList.remove('input-disabled');
  } else {
    toInput.disabled = true;
    toInput.setAttribute('data-disabled', 'true');
    toInput.value = '';
  }
  });

  // ----------------- 모달 열기/닫기 -----------------
  dateBtn?.addEventListener('click', () => {
    dim.style.display = 'block';
    modal.style.display = 'block';
  });

  dim?.addEventListener('click', () => {
      
    dim.style.display = 'none';
    modal.style.display = 'none';
    
  // 월/일 모달 제거
  removeDateModals();
  });

  applyBtn?.addEventListener("click", () => {
  dim.style.display = "none";
  modal.style.display = "none";

  // 월/일 모달 제거
  removeDateModals();

  const fromDate = fromInput.value;
  const toDate = toInput.value;
  currentOrder = tempOrder || 'desc';

    // 날짜가 둘 다 설정되어 있으면 유효성 검사
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
  
      if (from > to) {
        alert("❗ 종료일은 시작일 이후여야 합니다.");
        return;
      }
  
      // 날짜 필터와 정렬 모두 반영
      fetchPayList({ fromDate, toDate, order: currentOrder });
      } else {
      // 날짜 없으면 정렬만 반영
      fetchPayList({ order: currentOrder });
        }
  });

function removeDateModals() {
const monthModal = document.getElementById("month-modal");
const dayModal = document.getElementById("day-modal");

if (monthModal) {
  monthModal.remove();
}
if (dayModal) {
  dayModal.remove();
}
}

// ---------------- Today / Reset / Apply----------------
todayBtn?.addEventListener('click', () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formatted = `${yyyy}-${mm}-${dd}`;
  fromInput.value = formatted;
  toInput.value = formatted;
});

resetBtn?.addEventListener('click', () => {
  fromInput.value = '';
  toInput.value = '';
  currentOrder = 'desc';
  fetchPayList({ order: currentOrder });
});

// ---------------- 달력 아이콘 클릭 시 흐름 ----------------
document.body.addEventListener("click", function (e) {
  const icon = e.target.closest(".calendar-icon");
  if (!icon) return;
  
    const targetId = icon.dataset.target;
    const targetInput = document.getElementById(targetId);

    //to-date 비활성화 상태면 막기
    if (targetId === "to-date" && targetInput.disabled) {
      const fromVal = document.getElementById('from-date')?.value;
    if (!fromVal) {
      alert("먼저 시작 날짜(From)를 선택해주세요.");
      return;
    }
    }

    // 기존 모달 숨기기
    modal.style.display = "none";

    // 이전 모달 제거
    const oldMonthModal = document.getElementById("month-modal");
    const oldDayModal = document.getElementById("day-modal");
    if (oldMonthModal) oldMonthModal.remove();
    if (oldDayModal) oldDayModal.remove();

    // 월 선택 모달 생성
    const monthModal = document.createElement("div");
    monthModal.id = "month-modal";
    monthModal.className = "date-modal";
    monthModal.style.zIndex = "101";
    monthModal.innerHTML = `<div id="month-picker-container"></div>`;
    document.body.appendChild(monthModal);

    const monthContainer = document.getElementById("month-picker-container");

    flatpickr(monthContainer, {
      inline: true,
      locale: flatpickr.l10ns.ko,
      plugins: [
        new monthSelectPlugin({
          shorthand: false,
          dateFormat: "Y-m",
          altFormat: "Y년 m월",
          theme: "light"
        })
      ],

      //월 비활성화
      onReady: function (_, __, fp) {
        const fromValue = fromInput?.value;
        if (targetId === 'to-date' && fromValue) {
          const min = new Date(fromValue);
          const minYear = min.getFullYear();
          const minMonth = min.getMonth(); // 0-based (0 = Jan)
    
          const months = fp.calendarContainer.querySelectorAll('.flatpickr-monthSelect-month');
          months.forEach((el, i) => {
            const monthIndex = i % 12;
            const year = minYear + Math.floor(i / 12);
            if (year < minYear || (year === minYear && monthIndex < minMonth)) {
              el.classList.add('disabled');
              el.style.pointerEvents = 'none';
              el.style.opacity = '0.3';
            }
          });
          //연도 화살표 비활성화
          const prevBtn = fp.calendarContainer.querySelector('.flatpickr-prev-month');
          const currentYear = fp.currentYear;
      
          if (currentYear <= minYear) {
            prevBtn.classList.add('disabled');
            prevBtn.style.pointerEvents = 'none';
            prevBtn.style.opacity = '0.3';
          }
        }
      },
      onChange: function (selectedDates) {
        const selected = selectedDates[0];
        const year = selected.getFullYear();
        const month = selected.getMonth();

        const today = new Date();
        const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD        

        // 월 모달 제거 후 일 모달 생성
        monthModal.remove();

        const dayModal = document.createElement("div");
        dayModal.id = "day-modal";
        dayModal.className = "date-modal";
        dayModal.style.zIndex = "102";
        dayModal.innerHTML = `<div id="day-picker-container"></div>`;
        document.body.appendChild(dayModal);

        const dayContainer = document.getElementById("day-picker-container");

        const dayPickerConfig = {
          inline: true,
          defaultDate: todayStr, // 오늘 날짜 강조
          locale: flatpickr.l10ns.ko,
          onReady: function (selectedDates, dateStr, instance) {
            instance.changeMonth(month - instance.currentMonth);  // 해당 월로 이동
            instance.changeYear(year); // 연도도 변경
          },
          onChange: function (dates, str) {
            targetInput.value = str;
        
            // 모달 복귀
            dayModal.remove();
            modal.style.display = "block";
            dim.style.display = "block";
          }
        };
        
        //To 날짜 선택 시 → From 이후만 선택 가능
        if (targetId === 'to-date' && fromInput?.value) {
          dayPickerConfig.minDate = fromInput.value;
        }
        
        // From 날짜 선택 시 → To보다 이후 날짜 선택 방지도 가능 (선택 사항)
        if (targetId === 'from-date' && toInput?.value) {
          dayPickerConfig.maxDate = toInput.value;
        }
        
        flatpickr(dayContainer, dayPickerConfig);
        

        setTimeout(() => {
          const calendarContainer = document.querySelector("#day-modal .flatpickr-calendar");
        
          if (calendarContainer) {
            calendarContainer.style.width = "100%";
            calendarContainer.style.maxWidth = "100%";
            calendarContainer.style.boxSizing = "border-box";
        
            const inner = calendarContainer.querySelector(".flatpickr-innerContainer");
            if (inner) {
              inner.style.display = "flex";
              inner.style.flexDirection = "column";
              inner.style.alignItems = "center";
              inner.style.justifyContent = "center";
              inner.style.width = "100%";
            }
        
            const days = calendarContainer.querySelector(".flatpickr-days");
            if (days) {
              days.style.width = "100%";
              days.style.margin = "0";
            }
        
            const dayContainer = calendarContainer.querySelector(".dayContainer");
            if (dayContainer) {
              dayContainer.style.justifyContent = "center";
              dayContainer.style.alignItems = "center";
            }
          }
        }, 0);
        
      }
    });
  });

window.initPayPage = initPayPage;
window.fetchPayList = fetchPayList;

// ----------------- 정렬 드롭다운 기능 -----------------

  selected.addEventListener("click", () => {
    options.style.display = options.style.display === "block" ? "none" : "block";
  });

  options.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => {
      selected.childNodes[0].nodeValue = li.textContent;
      selected.setAttribute("data-value", li.dataset.value);
      tempOrder = li.dataset.value;
      options.style.display = "none";
      console.log("정렬 선택됨:", li.dataset.value);
    });
  });

// ---------------- 모달 복귀 함수 ----------------
function restoreModalContent() {
  const original = modal.getAttribute('data-original');
  if (original) {
    modal.innerHTML = original;
    modal.removeAttribute('data-original');
  }
}

  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener("click", (e) => {
    if (!selected.contains(e.target) && !options.contains(e.target)) {
      options.style.display = "none";
    }
  });
  console.log("initPayPage 실행됨");

  //페이지 처음 로드 시 전체 목록 불러오기
  fetchPayList({ order: currentOrder });


  //---------------- 필터링---------------
  const branchButtons = document.querySelectorAll('.branch-btn');

branchButtons.forEach(button => {
  button.addEventListener('click', function () {
    this.classList.toggle('active');

    const activeBranches = Array.from(document.querySelectorAll('.branch-btn.active'))
      .map(btn => btn.dataset.branch);

    filterByBranches(activeBranches);
  });
});

};

//---------------- 결제 목록 불러오기---------------
function fetchPayList({ fromDate = '', toDate = '', order = 'desc' } = {}) {
  const queryParams = new URLSearchParams();
  queryParams.append('order', order);

  if (fromDate && toDate) {
    queryParams.append('fromDate', fromDate);
    queryParams.append('toDate', toDate);
  }

  fetch(`http://34.201.234.67:8080/api/pay?${queryParams.toString()}`)
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById("pay-table-body");
    if (!tbody) {
      console.warn("⚠️ pay-table-body 요소 없음!");
      return;
    }

    tbody.innerHTML = ""; // 기존 내용 비우기

    data.forEach((pay, index) => {
      const row = document.createElement("tr");
      row.classList.add("order");
      row.setAttribute("data-branch", pay.storeLocation);
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${pay.paymentmethod}</td>
        <td>${pay.paymenthistory}</td>
        <td>${pay.amount.toLocaleString()}</td>
        <td>${formatDate(pay.paidat)}</td>
        <td>${pay.storeLocation}</td>
        <td>${pay.paycode}</td>
      `;
      tbody.appendChild(row);
    });

    if (typeof window.addEmptyRows === 'function') {
      window.addEmptyRows('pay-table-body');
    }
    checkForData('#pay-table-body', '.no-data');  
  })
  .catch(err => console.error("❌ 결제 데이터 불러오기 실패:", err));
}

function formatDate(dateStr) {
const date = new Date(dateStr);
return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

//---------------- 지점 필터 기능 추가---------------

// 1. 버튼 이벤트 핸들러 통합
document.querySelectorAll('.branch-btn').forEach(button => {
    button.addEventListener('click', function() {
      this.classList.toggle('active');
      
      // 활성화된 버튼 목록
      const activeBranches = Array.from(document.querySelectorAll('.branch-btn.active'))
        .map(btn => btn.dataset.branch);
  
      // 필터링 실행
      filterByBranches(activeBranches);
    });
  });
  
  // 2. 통합 필터링 함수
  function filterByBranches(activeBranches) {
    const rows = document.querySelectorAll('#pay-table-body tr');
    const branchMap = {
      gangseo: '강서지점',
      sangbong: '상봉지점',
      hanam: '하남지점'
    };

    let visibleCount = 0;

    rows.forEach(row => {
      if(row.classList.contains('empty-row')) return;
      
      const branchName = row.getAttribute('data-branch')?.trim();
      const isVisible = activeBranches.length === 0 || 
      activeBranches.some(code => branchMap[code] === branchName);
      
      row.style.display = isVisible ? '' : 'none';
      if (isVisible) visibleCount++;
    });

  
  if (typeof window.addEmptyRows === 'function') {
    window.addEmptyRows('pay-table-body');
  }
  
    checkForData('#pay-table-body', '.no-data');
  }
  
  // 3. 초기화 코드 유지
  document.addEventListener('DOMContentLoaded', () => {
    fetchPayList();
  });