<<<<<<< Updated upstream
// 지점 필터 버튼 초기화
const branchButtons = document.querySelectorAll('.branch-btn');
=======
// 발주 목록 가져오기
function fetchOrderList() {
    fetch("http://tomhoon.duckdns.org:8882/api/stock/branch")
        .then(res => res.json())
        .then(data => {
            const orders = Array.isArray(data) ? data : (data.orders || []);
            const tbody = document.getElementById("stock-table-body");
>>>>>>> Stashed changes

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
