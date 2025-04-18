<<<<<<< HEAD
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
                    '<img src="/images/stopsale.svg"/>' :
                    (quantity === 0 ? '<img src="/images/stopsale.svg"/>' : '<img src="/images/sale.svg"/>');

                // 주문 버튼 조건
                const orderButtonHTML = !isActive || quantity === 0 ?
                    `<button class="no-style-button orderbutton disabled" disabled style="opacity: 0.5; cursor: not-allowed;"></button>` :
                    `<button class="no-style-button orderbutton" data-branch="${officeName}" data-image="${imagePath}" data-menu-name="${menuName}">
            <img src="/images/orderbutton.svg" />
          </button>`;

                // 주문 상태 처리
                let orderStatus = '';
                switch (order.status) {
                    case "배송중":
                        orderStatus = '<img src="/images/indelivery.svg"/>';
                        break;
                    case "배송완료":
                        orderStatus = '<img src="/images/deliverycomplete.svg"/>';
                        break;
                    default:
                        orderStatus = '<img src="/images/checking.svg"/>';
                }

                // quantityDisplay 추가: quantity가 0일 때 이미지로, 아니면 숫자로 표시
                const quantityDisplay = quantity === 0 ? '<img src="/images/nostock.svg" alt="재고 없음"/>' : quantity;

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


function addEmptyRows(tbodyId, rowCount = 10) {
  const tbody = document.getElementById(tbodyId);
  const currentRows = tbody.querySelectorAll('tr').length;
  const emptyRowsToAdd = rowCount - currentRows;

  for (let i = 0; i < emptyRowsToAdd; i++) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
      `;
      emptyRow.classList.add('empty-row'); // 필요시 스타일링용
      tbody.appendChild(emptyRow);
  }
}


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
    image.src = "/icecream" + imagePath;
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




=======
// 지점 필터 버튼 초기화
const branchButtons = document.querySelectorAll('.branch-btn');

// 지점 버튼 토글 기능
branchButtons.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
    
    // 활성화된 지점 필터 수집
    const activeBranches = Array.from(
      document.querySelectorAll('.branch-btn.active')
    ).map(btn => btn.getAttribute('data-branch'));
    
    console.log('활성화된 지점:', activeBranches);
  });
});

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', () => {
  const orderRows = document.querySelectorAll('tr.order');
  const noDataMessage = document.querySelector('.no-data');

  // 테이블 필터링 함수
  function filterTableByBranch(branchName) {
    let visibleRowCount = 0;

    orderRows.forEach(row => {
      if (row.classList.contains('empty-row')) return;

      const rowBranch = row.getAttribute('data-branch');
      const shouldShow = branchName === 'all' || rowBranch === branchName;
      row.style.display = shouldShow ? '' : 'none';
      if (shouldShow) visibleRowCount++;
    });

    // 데이터 없을 때 메시지 표시
    noDataMessage.classList.toggle('hidden', visibleRowCount > 0);
  }

  // 지점 버튼 클릭 이벤트
  branchButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 모든 버튼 비활성화 후 클릭한 버튼만 활성화
      branchButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      filterTableByBranch(this.getAttribute('data-branch'));
    });
  });

  // 초기 전체 데이터 표시
  filterTableByBranch('all');
});

// 모달 관련 변수
let currentOrderRow = null;
let currentModal = null;

// 모달 열기 함수 (안전한 접근 추가)
function openOrderModal(button) {
  currentOrderRow = button.closest('tr.order');
  if (!currentOrderRow) return;

  const branch = currentOrderRow.dataset.branch;
  currentModal = document.getElementById(`orderModal-${branch}`);
  if (currentModal) {
    currentModal.classList.remove('hidden');
  }
}

// 모달 닫기 함수
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.add('hidden');
  });
}

// 이벤트 위임 처리 (전체 문서)
document.addEventListener('click', (e) => {
  // 수량 조절 버튼
  if (e.target.classList.contains('minus-btn')) {
    const input = e.target.nextElementSibling;
    if (input) input.stepDown();
  }
  if (e.target.classList.contains('plus-btn')) {
    const input = e.target.previousElementSibling;
    if (input) input.stepUp();
  }

  // 모달 닫기/확인 처리
  if (e.target.classList.contains('modalCancel')) {
    closeAllModals();
  }
  if (e.target.classList.contains('modalConfirm')) {
    handleConfirmClick(e); // 이벤트 객체 전달
  }
});

// 확인 버튼 처리 (함수 선언 방식 변경)
function handleConfirmClick(e) {
  const modal = e.target.closest('.modal');
  const row = document.querySelector(`tr[data-branch="${modal.id.split('-')[1]}"]`);

  if (!row) return;

  // 1. 주문 데이터 처리
  const quantityInput = modal.querySelector('.quantity-input');
  if (!quantityInput) return;

  const orderData = {
    branch: row.dataset.branch,
    no: row.cells[0].textContent,
    name: row.cells[1].textContent,
    menu: row.cells[2].textContent,
    image: row.cells[3].textContent,
    stock: row.cells[4].textContent || 
           row.cells[4].querySelector('img')?.src,
    status: row.cells[5].querySelector('img')?.src,
    orderStatus: row.cells[6].querySelector('img')?.src,
    quantity: parseInt(quantityInput.value)
  };
  
  sendOrderData(orderData);

  // 2. 알림 이미지 동적 생성 및 표시
 // 알림 이미지 생성 및 표시 (위치 조정)
const alertImg = document.createElement('img');
alertImg.src = '/images/Frame1043.png';
alertImg.className = 'alarm-png';
alertImg.style.position = 'fixed';
alertImg.style.top = '80%'; // 중앙으로 이동
alertImg.style.left = '50%'; // 중앙으로 이동
alertImg.style.transform = 'translate(-50%, 20%)'; // 중앙에서 아래로 살짝 이동
alertImg.style.width = '200px';
alertImg.style.zIndex = '10000';
alertImg.style.transition = 'all 0.5s ease';
alertImg.style.opacity = '0';

document.body.appendChild(alertImg);
setTimeout(() => {
  alertImg.style.opacity = '1';
  alertImg.style.transform = 'translate(-50%, 20%) scale(1)'; // 애니메이션 시작
}, 50);

  setTimeout(() => {
    alertImg.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(alertImg);
    }, 500);
  }, 3000);

  // 3. 모달 닫기
  closeAllModals();
}

// 주문 데이터 전송
function sendOrderData(data) {
  console.log('발주 데이터 전송:', data);
  /* 실제 API 호출 로직 구현 */
}

// 결제 페이지 초기화 함수
window.initPayPage = function() {
  console.log('결제 페이지 초기화 완료');
};
>>>>>>> upload
