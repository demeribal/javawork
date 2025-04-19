document.addEventListener('DOMContentLoaded', () => {
  window.fetchOrderList = fetchOrderList;
});

// 발주 목록 가져오기
function fetchOrderList() {
  fetch("http://localhost:8080/api/stock/branch")
    .then(res => res.json())
    .then(data => {
      // 데이터가 배열 형태로 반환되는지 확인
      console.log(data);  // data 객체의 구조 확인
      const orders = Array.isArray(data) ? data : (data.orders || []);
      const tbody = document.getElementById("stock-table-body");
      console.log(tbody); // tbody 요소가 제대로 선택되었는지 확인
      if (!tbody) {
        console.warn("⚠️ stock-table-body 요소 없음!");
        return;
      }

      tbody.innerHTML = ""; // 기존 내용 비우기

      orders.forEach((order, idx) => {
        const row = document.createElement("tr");
        row.classList.add("order");

        // 데이터 값 추출
        const officeName = order.officeName || "";
        const menuName = order.menuName || "";
        const quantity = order.quantity ?? 0;
        const imagePath = order.imagePath || "";
        const productStatus = quantity === 0 ? "판매중단" : "판매중"; // 상품 상태
        const orderStatus = order.status || "확인중"; // 발주 상태

        // 데이터로 행 내용 채우기
        row.innerHTML = `
          <td>${idx + 1}</td>
          <td>${officeName}</td>
          <td>${menuName}</td>
          <td><img src="/branch/${imagePath}" width="40" height="40"></td>
          <td>${quantity}</td>
          <td>${productStatus}</td>
          <td>${orderStatus}</td>
          <td>
            <button onclick="sendData(${order.orderId}, ${quantity})" 
            class="no-style-button">
            <img src="/images/orderbutton.svg" /></button>
          </td>
        `;
        tbody.appendChild(row);
      });

      addEmptyRows('stock-table-body');
      checkForData('#stock-table-body', '.no-data');  
    })
    .catch(err => console.error("❌ 발주 데이터 불러오기 실패:", err));
}

// 테이블이 비어있는지 확인하고 "조회 내용이 없습니다." 메시지를 보여주는 함수
function checkForData(tbodySelector, noDataSelector) {
  const tbody = document.querySelector(tbodySelector);
  const noData = document.querySelector(noDataSelector);
  if (tbody && noData) {
    if (tbody.rows.length === 0) {
      noData.style.display = "block";  // 데이터가 없을 때 메시지 표시
    } else {
      noData.style.display = "none";  // 데이터가 있을 때 메시지 숨기기
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded 이벤트 발생');
  window.fetchOrderList = fetchOrderList;
  fetchOrderList();  // fetchOrderList 호출 확인
});

// 재고량 아이콘 업데이트
// function handleStockInput(input) {
//   const value = parseInt(input.value);
//   const icon = input.parentElement.querySelector('.stock-icon');
  
//   if(value === 0) {
//     input.classList.add('zero-stock');
//     icon.classList.remove('hidden');
//     icon.style.pointerEvents = 'auto';
//   } else {
//     input.classList.remove('zero-stock');
//     icon.classList.add('hidden');
//   }
//   saveStockValue(input.value); // 추가 기능 (필요시 구현)
// }

// // 포커스 아웃 시 처리
// function handleStockBlur(input) {
//   const value = parseInt(input.value);
//   if(isNaN(value) || value < 0) {
//     input.value = 0;
//     handleStockInput(input); // 아이콘 갱신
//   }
// }

// // 포커스 인 시 처리
// function handleStockFocus(input) {
//   if(input.value === '') {
//     input.value = 0;
//     handleStockInput(input); // 아이콘 갱신
//   }
//   input.select();
// }

// // 값 저장 함수 (예시)
// function saveStockValue(value) {
//   console.log('Saved stock:', value);
//   // 실제 저장 로직 구현
// }

// // 아이콘 클릭 핸들러
// function handleIconClick(icon) {
//   const input = icon.previousElementSibling;
  
//   // 1. 아이콘 즉시 숨기기
//   icon.classList.add('hidden');
//   icon.style.pointerEvents = 'none';
  
//   // 2. 입력 필드 활성화
//   input.focus();
//   input.select();
  
//   // 3. 입력값 0으로 설정 (숫자 복구)
//   input.value = 0;
//   input.classList.remove('zero-stock');
// }

// // 상품 상태 선택 핸들러
// function selectProductOption(element) {
//   const container = element.closest('.custom-dropdown');
//   const selectedImg = container.querySelector('.product-status-icon');
//   selectedImg.src = `/images/${element.dataset.value}`;
  
//   // 드롭다운 닫기
//   container.querySelector('.dropdown-stock-options').style.display = 'none';
// }

// // 드롭다운 토글 함수
// function toggleDropdown(element) {
//   const dropdown = element.closest('.custom-dropdown')
//                          .querySelector('.dropdown-stock-options');
//   dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
// }

// // 상태 아이콘 업데이트
// function updateStatusIcon(select) {
//   const container = select.closest('.status-container');
//   const icon = container.querySelector('.order-status-icon'); // 발주 상태 전용
//   const selectedValue = select.options[select.selectedIndex].value;
//   icon.src = `/images/${selectedValue}`;
// }
