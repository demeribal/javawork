
window.initPayPage = initPayPage;
window.fetchPayList = fetchPayList;

let currentOrder = 'desc'; // 실제 적용된 정렬 값
let tempOrder = ''; 

  
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
/*
applyBtn.addEventListener('click', () => {
  // 필요한 필터 로직 추가 가능
  dim.style.display = 'none';
  modal.style.display = 'none';

   // 월 선택 모달 제거
  const monthModal = document.getElementById("month-modal");
  if (monthModal) monthModal.remove();

  // 일 선택 모달 제거
  const dayModal = document.getElementById("day-modal");
  if (dayModal) dayModal.remove();
});
*/

// ---------------- 달력 아이콘 클릭 시 흐름 ----------------
document.querySelectorAll(".calendar-icon").forEach(icon => {
  icon.addEventListener("click", (e) => {
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
};

//---------------- 결제 목록 불러오기---------------
function fetchPayList({ fromDate = '', toDate = '', order = 'desc' } = {}) {
  const queryParams = new URLSearchParams();
  queryParams.append('order', order);

  if (fromDate && toDate) {
    queryParams.append('fromDate', fromDate);
    queryParams.append('toDate', toDate);
  }

  fetch(`http://tomhoon.duckdns.org:8882/api/pay?${queryParams.toString()}`)
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
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${pay.paymentmethod}</td>
        <td>${pay.paymenthistory}</td>
        <td>${pay.amount.toLocaleString()}</td>
        <td>${formatDate(pay.paidat)}</td>
        <td>강서지점</td>
        <td>${pay.paycode}</td>
      `;
      tbody.appendChild(row);
    });

    addEmptyRows('pay-table-body');
    checkForData('#pay-table-body', '.no-data');  
  })
  .catch(err => console.error("❌ 결제 데이터 불러오기 실패:", err));
}

function formatDate(dateStr) {
const date = new Date(dateStr);
return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}
