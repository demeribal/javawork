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
//document.querySelector('.branch-btn[data-branch="all"]').classList.add('active');

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







let currentOrderRow = null;
let currentModal = null;

// 모달 열기 (모든 지점 대응)
function openOrderModal(button) {
  currentOrderRow = button.closest('tr.order');
  const branch = currentOrderRow.dataset.branch;
  currentModal = document.getElementById(`orderModal-${branch}`);
  currentModal.classList.remove('hidden');
}

// 범용 닫기 함수
function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.add('hidden');
  });
}

// 이벤트 위임 처리 (전체 문서에 적용)
document.addEventListener('click', (e) => {
  // 숫자 조절
  if (e.target.classList.contains('minus-btn')) {
    const input = e.target.nextElementSibling;
    input.stepDown();
  }
  if (e.target.classList.contains('plus-btn')) {
    const input = e.target.previousElementSibling;
    input.stepUp();
  }

  // 모달 컨트롤
  if (e.target.classList.contains('modalCancel')) {
    closeAllModals();
  }
  if (e.target.classList.contains('modalConfirm')) {
    handleConfirmClick();
  }
});

// 확인 버튼 핸들러
function handleConfirmClick() {
  if (currentOrderRow && currentModal) {
    const quantity = currentModal.querySelector('.quantity-input').value;
    const orderData = {
      branch: currentOrderRow.dataset.branch,
      no: currentOrderRow.cells[0].textContent,
      name: currentOrderRow.cells[1].textContent,
      menu: currentOrderRow.cells[2].textContent,
      image: currentOrderRow.cells[3].textContent,
      stock: currentOrderRow.cells[4].textContent || 
             currentOrderRow.cells[4].querySelector('img')?.src,
      status: currentOrderRow.cells[5].querySelector('img').src,
      orderStatus: currentOrderRow.cells[6].querySelector('img').src,
      quantity: parseInt(quantity)
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