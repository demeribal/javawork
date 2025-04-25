// 발주 목록 가져오기
function fetchOrderList() {
    fetch("http://localhost:8080/api/stock/branch")
        .then(res => res.json())
        .then(data => {
            const orders = Array.isArray(data) ? data : (data.orders || []);
            const tbody = document.getElementById("stock-table-body");

            if (!tbody) {
                console.warn("⚠️ stock-table-body 요소 없음!");
                return;
            }

            tbody.innerHTML = ""; // 기존 내용 비우기

            orders.forEach((order, idx) => {
                const row = document.createElement("tr");
                row.classList.add("order");
                row.setAttribute('data-branch', order.officeName || ""); // 지점명 데이터 속성 추가

                // 데이터 추출
                const officeName = order.officeName || "";
                const menuName = order.menuName || "";
                const quantity = order.quantity ?? 0;
                const imagePath = order.imagePath || "";

                // use 필드 기반 상태 처리
                const isActive = order.use !== false; // use가 명시적으로 false가 아닌 경우 활성화
                const productStatus = !isActive ?
                    '<img src="/admin_page/images/stopsale.svg"/>' :
                    (quantity === 0 ? '<img src="/admin_page/images/stopsale.svg"/>' : '<img src="/admin_page/images/sale.svg"/>');

                // 주문 버튼 조건
                const orderButtonHTML = !isActive || quantity === 0 ?
                    `<button class="no-style-button orderbutton disabled" disabled style="opacity: 0.5; cursor: not-allowed;"></button>` :
                    `<button class="no-style-button orderbutton" data-branch="${officeName}" data-image="${imagePath}" data-menu-name="${menuName}">
            <img src="/admin_page/images/orderbutton.svg" style="position: relative; left: 20px;"/>
          </button>`;

                // 주문 상태 처리
                let orderStatus = '';
                switch (order.status) {
                    case "배송중":
                        orderStatus = '<img src="/admin_page/images/indelivery.svg"/>';
                        break;
                    case "배송완료":
                        orderStatus = '<img src="/admin_page/images/deliverycomplete.svg"/>';
                        break;
                    default:
                        orderStatus = '<img src="/admin_page/images/checking.svg"/>';
                }

                // quantityDisplay 추가: quantity가 0일 때 이미지로, 아니면 숫자로 표시
                const quantityDisplay = quantity === 0 ? '<img src="/admin_page/images/nostock.svg" alt="재고 없음"/>' : quantity;

                // 행 구성
                row.innerHTML = `
          <td>${idx + 1}</td>
          <td>${officeName}</td>
          <td>${menuName}</td>
          <td>${imagePath}</td>
          <td>${quantityDisplay}</td>
          <td>${productStatus}</td>
          <td>${orderStatus}</td>
          <td>${orderButtonHTML}</td>
        `;
                tbody.appendChild(row);
            });

            addEmptyRows('stock-table-body');
            checkForData('#stock-table-body', '.no-data');
        })
        .catch(err => console.error("❌ 발주 데이터 불러오기 실패:", err));
}


document.addEventListener('DOMContentLoaded', () => {
  window.fetchOrderList = fetchOrderList;
});



// 테이블이 비어있는지 확인하고 "조회 내용이 없습니다." 메시지를 보여주는 함수
function checkForData(tbodySelector, noDataSelector) {
  const tbody = document.querySelector(tbodySelector);
  const noData = document.querySelector(noDataSelector);
  if (tbody && noData) {
      if (tbody.rows.length === 0) {
          noData.style.display = "block";   // 데이터가 없을 때 메시지 표시
      } else {
          noData.style.display = "none";   // 데이터가 있을 때 메시지 숨기기
      }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded 이벤트 발생');
  window.fetchOrderList = fetchOrderList;
  fetchOrderList();   // 초기 로딩

});


// function addEmptyRows(tbodyId, rowCount = 10) {
//   const tbody = document.getElementById(tbodyId);
//   const currentRows = tbody.querySelectorAll('tr').length;
//   const emptyRowsToAdd = rowCount - currentRows;

//   for (let i = 0; i < emptyRowsToAdd; i++) {
//       const emptyRow = document.createElement("tr");
//       emptyRow.innerHTML = `
//           <td>&nbsp;</td>
//           <td>&nbsp;</td>
//           <td>&nbsp;</td>
//           <td>&nbsp;</td>
//           <td>&nbsp;</td>
//           <td>&nbsp;</td>
//           <td>&nbsp;</td>
//           <td>&nbsp;</td>
//       `;
//       emptyRow.classList.add('empty-row'); // 필요시 스타일링용
//       tbody.appendChild(emptyRow);
//   }
// }


// 재고량 아이콘 업데이트
function handleStockInput(input) {
  const value = parseInt(input.value);
  const icon = input.parentElement.querySelector('.stock-icon');

  if (value === 0) {
      input.classList.add('zero-stock');
      icon.classList.remove('hidden');
      icon.style.pointerEvents = 'auto';
  } else {
      input.classList.remove('zero-stock');
      icon.classList.add('hidden');
  }
  saveStockValue(input.value); // 추가 기능 (필요시 구현)
}





// 지점 선택 가능
document.addEventListener('DOMContentLoaded', () => {
  const branchButtons = document.querySelectorAll('.branch-btn');

  // 지점 버튼 클릭 이벤트 처리
  branchButtons.forEach(button => {
      button.addEventListener('click', () => {
          // 버튼의 active 상태 토글
          button.classList.toggle('active');

          // 활성화된 지점 목록 가져오기
          const activeBranches = Array.from(document.querySelectorAll('.branch-btn.active'))
              .map(btn => btn.getAttribute('data-branch'));

          // 테이블 내의 모든 발주 행(tr.order)을 가져옴
          const orderRows = document.querySelectorAll('tr.order');

          // 각 행에 대해 필터링 적용
          orderRows.forEach(row => {
              const branch = row.getAttribute('data-branch');

              // 빈 행은 무시
              if (row.classList.contains('empty-row')) return;

              // 지점이 하나도 선택 안 됐으면 전체 보여주기
              if (activeBranches.length === 0 || activeBranches.includes('all')) {
                  row.style.display = '';
              } else {
                  row.style.display = activeBranches.includes(branch) ? '' : 'none';
              }
          });

          // 필요한 경우: "조회 내용이 없습니다" 메시지 처리
          checkForData('#stock-table-body', '.no-data');
      });
  });
});




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
    const rows = document.querySelectorAll('#stock-table-body tr');
    const branchMap = {
      gangseo: '강서지점',
      sangbong: '상봉지점',
      hanam: '하남지점'
    };
  
    rows.forEach(row => {
      if(row.classList.contains('empty-row')) return;
      
      const branchName = row.querySelector('td:nth-child(2)').textContent;
      const isVisible = activeBranches.length === 0 || 
                       activeBranches.some(code => branchMap[code] === branchName);
      
      row.style.display = isVisible ? '' : 'none';
    });
  
    checkForData('#stock-table-body', '.no-data');
  }
  
  // 3. 초기화 코드 유지
  document.addEventListener('DOMContentLoaded', () => {
    fetchOrderList();
  });






// 모달 열기 함수
function openOrderModal(branchName, imagePath, menuName) {
    const modal = document.getElementById('orderModal');
    const image = document.getElementById('icecreamImage');
    const icecreamName = document.getElementById('icecreamName');
    const quantityInput = modal.querySelector('.quantity-input'); // 수량 입력 필드

    // 모달 이미지 변경
    image.src = "/admin_page/icecream" + imagePath;
    image.alt = branchName + ' 상품 이미지';

    // 모달에 지점명 저장
    modal.setAttribute('data-branch', branchName);

    // 아이스크림 이름 설정
    icecreamName.textContent = menuName;

    // 수량 초기화
    quantityInput.value = 1;

    // 모달 보이게 하기
    modal.classList.remove('hidden');
    modal.classList.add('show');
    currentModal = modal; // 현재 열린 모달 설정

    // **여기서 이벤트 리스너를 설정합니다.**
    // 모달 컨테이너 참조 (모달이 열릴 때마다 업데이트)
    modalContent = modal.querySelector('.modal-content');

    // 이전 이벤트 리스너 제거 (중복 방지)
    modalContent.removeEventListener('click', quantityControl);

    // 모달 내부에서만 이벤트 처리
    modalContent.addEventListener('click', quantityControl);
}

// 수량 조절 및 모달 컨트롤 함수
function quantityControl(e) {
    const input = e.target.closest('.number-control')?.querySelector('input');
    if (input) {
        if (e.target.classList.contains('minus-btn')) {
            input.value = Math.max(parseInt(input.value, 10) - 1, input.min || 1);
        }
        if (e.target.classList.contains('plus-btn')) {
            input.value = parseInt(input.value, 10) + 1;
        }
    }

    // 모달 컨트롤
    if (e.target.classList.contains('modalCancel')) {
        closeAllModals();
    }
    if (e.target.classList.contains('modalConfirm')) {
        handleConfirmClick();
    }
}

// 발주하기 버튼 클릭 이벤트 리스너
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.orderbutton');
    if (btn) {
        const branchName = btn.getAttribute('data-branch');
        const imagePath = btn.getAttribute('data-image');
        const menuName = btn.getAttribute('data-menu-name');

        console.log("버튼에서 가져온 이미지 경로:", imagePath);

        currentOrderRow = btn.closest('tr.order');
        openOrderModal(branchName, imagePath, menuName);
    }

    // #orderModal 클릭하면 .modal-content 닫히게
    document.getElementById('orderModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) { // 모달 영역을 클릭했는지 확인
            closeAllModals();
        }
    });
});

// 범용 닫기 함수
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
    });
    currentOrderRow = null;
    currentModal = null;

    // 모달 닫힐 때 이벤트 리스너 제거
    if (modalContent) {
        modalContent.removeEventListener('click', quantityControl);
    }
}






// 확인 버튼 핸들러
function handleConfirmClick() {
    if (currentOrderRow && currentModal) {
        const quantityInput = currentModal.querySelector('.quantity-input');
        const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 0;

        const orderData = {
            branch: currentOrderRow.getAttribute('data-branch'),
            no: currentOrderRow.cells[0].textContent,
            name: currentOrderRow.cells[1].textContent,
            menu: currentOrderRow.cells[2].textContent,
            image: currentOrderRow.cells[3].textContent,
            stock: parseInt(currentOrderRow.cells[4].textContent, 10),
            status: currentOrderRow.cells[5].textContent,
            orderStatus: currentOrderRow.cells[6].textContent,
            quantity: quantity
        };
        sendOrderData(orderData);
    }
    closeAllModals();
}

// 데이터 전송 함수
function sendOrderData(data) {
  console.log('발주 데이터 전송:', data);
  /* 실제 전송 로직 구현 */
}
window.fetchOrderList = fetchOrderList;