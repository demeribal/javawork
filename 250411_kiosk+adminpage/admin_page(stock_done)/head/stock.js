  
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


  

// 재고량 아이콘 업데이트
// 실시간 입력 처리
function handleStockInput(input) {
  const value = parseInt(input.value);
  const icon = input.parentElement.querySelector('.stock-icon');
  
  if(value === 0) {
    input.classList.add('zero-stock');
    icon.classList.remove('hidden');
    icon.style.pointerEvents = 'auto';
  } else {
    input.classList.remove('zero-stock');
    icon.classList.add('hidden');
  }
  saveStockValue(input.value); // 추가 기능 (필요시 구현)
}

// 포커스 아웃 시 처리
function handleStockBlur(input) {
  const value = parseInt(input.value);
  if(isNaN(value) || value < 0) {
    input.value = 0;
    handleStockInput(input); // 아이콘 갱신
  }
}

// 포커스 인 시 처리
function handleStockFocus(input) {
  if(input.value === '') {
    input.value = 0;
    handleStockInput(input); // 아이콘 갱신
  }
  input.select();
}

// 값 저장 함수 (예시)
function saveStockValue(value) {
  console.log('Saved stock:', value);
  // 실제 저장 로직 구현
}








// 아이콘 클릭 핸들러
function handleIconClick(icon) {
  const input = icon.previousElementSibling;
  
  // 1. 아이콘 즉시 숨기기
  icon.classList.add('hidden');
  icon.style.pointerEvents = 'none';
  
  // 2. 입력 필드 활성화
  input.focus();
  input.select();
  
  // 3. 입력값 0으로 설정 (숫자 복구)
  input.value = 0;
  input.classList.remove('zero-stock');
}








// 상품 상태 선택 핸들러
function selectProductOption(element) {
  const container = element.closest('.custom-dropdown');
  const selectedImg = container.querySelector('.product-status-icon');
  selectedImg.src = `/images/${element.dataset.value}`;
  
  // 드롭다운 닫기
  container.querySelector('.dropdown-stock-options').style.display = 'none';
}

// 드롭다운 토글 함수
function toggleDropdown(element) {
  const dropdown = element.closest('.custom-dropdown')
                         .querySelector('.dropdown-stock-options');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

  



  
// 상태 아이콘 업데이트
function updateStatusIcon(select) {
  const container = select.closest('.status-container');
  const icon = container.querySelector('.order-status-icon'); // 발주 상태 전용
  const selectedValue = select.options[select.selectedIndex].value;
  icon.src = `/images/${selectedValue}`;
}

function toggleDropdown(element) {
  const options = element.nextElementSibling;
  options.style.display = options.style.display === 'block' ? 'none' : 'block';
}

function selectOption(element) {
  const container = element.closest('.custom-dropdown');
  const selectedImg = container.querySelector('.order-status-icon'); // 발주 상태 전용
  selectedImg.src = `/images/${element.dataset.value}`;
  container.querySelector('.dropdown-stock-options').style.display = 'none';
}

// 이벤트 위임 방식 (전체 처리)
document.body.addEventListener('click', (e) => {
  const row = e.target.closest('tr.order');
  if(!row) return;

  if(e.target.id === 'confirmBtn') {
    row.dataset.orderCurrentSelection = row.dataset.pendingSelection || 'checking.svg';
    updateOrderStatusIcon(row);
    closeModal(row);
  }

  if(e.target.id === 'cancelBtn' || e.target.id === 'closeBtn') {
    const orderIcon = row.querySelector('.order-status-icon');
    const productIcon = row.querySelector('.product-status-icon');
    orderIcon.src = `/images/${row.dataset.orderStatus}`;
    productIcon.src = `/images/${row.dataset.productStatus}`;
    closeModal(row);
  }
});

// 옵션 클릭 핸들러
function handleOptionClick(event, element) {
  const row = element.closest('tr.order');
  row.dataset.pendingSelection = element.dataset.value;
  const display = row.querySelector('.selected-stock-option .order-status-icon'); // 발주 상태 전용
  display.src = `/images/${element.dataset.value}`;
  
  const modal = row.querySelector('[data-modal-for="delivery"]');
  const dropdown = row.querySelector('.dropdown-stock-options');
  modal.classList.remove('hidden');
  dropdown.style.display = 'none';
}

// 모달 닫기
function closeModal(row) {
  const modal = row.querySelector('[data-modal-for="delivery"]');
  const dropdown = row.querySelector('.dropdown-stock-options');
  modal.classList.add('hidden');
  dropdown.style.display = 'none';
}

// 발주 상태 아이콘 업데이트
function updateOrderStatusIcon(row) {
  const icon = row.querySelector('.status-cell2 .order-status-icon'); // 발주 상태 전용
  icon.src = `/images/${row.dataset.orderCurrentSelection}`;
}

// 상태 관리 변수
let currentModalRow = null;

// 모달 닫기 + 드롭다운 닫기
function closeAll(row) {
  const modal = row.querySelector('[data-modal-for="delivery"]');
  const dropdown = row.querySelector('.dropdown-stock-options');
  modal.classList.add('hidden');
  dropdown.style.display = 'none';
}

// 드롭다운 옵션 클릭 핸들러
function handleOptionClick(event, element) {
  const row = element.closest('tr.order');
  currentModalRow = row;
  
  document.querySelectorAll('.dropdown-stock-options').forEach(d => {
    if(d !== element.closest('.dropdown-stock-options')) {
      d.style.display = 'none';
    }
  });

  const modal = row.querySelector('[data-modal-for="delivery"]');
  modal.classList.remove('hidden');
  row.dataset.pendingSelection = element.dataset.value;
}

// 모달 버튼 이벤트 위임
document.body.addEventListener('click', (e) => {
  const row = currentModalRow;
  if(!row) return;

  if(e.target.id === 'confirmBtn') {
    row.dataset.orderCurrentSelection = row.dataset.pendingSelection;
    updateOrderStatusIcon(row);
    closeAll(row);
  }

  if(e.target.id === 'cancelBtn' || e.target.id === 'closeBtn') {
    const tempIcon = row.querySelector('.selected-stock-option .order-status-icon'); // 발주 상태 전용
    tempIcon.src = `/images/${row.dataset.orderCurrentSelection}`;
    closeAll(row);
  }
});

// 드롭다운 토글 함수
function toggleDropdown(element) {
  const dropdown = element.closest('.custom-dropdown')
                         .querySelector('.dropdown-stock-options');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}




//서로 영향 끼치지 않는 명령어//
// 1. 드롭다운 토글 함수 분리
function toggleOrderDropdown(element) {
  const dropdown = element.closest('.custom-dropdown')
                         .querySelector('.dropdown-order-options');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function toggleProductDropdown(element) {
  const dropdown = element.closest('.custom-dropdown')
                         .querySelector('.dropdown-product-options');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// 2. 옵션 선택 핸들러 분리
function selectOrderOption(element) {
  const container = element.closest('.custom-dropdown');
  const selectedImg = container.querySelector('.order-status-icon');
  selectedImg.src = `/images/${element.dataset.value}`;
  container.querySelector('.dropdown-order-options').style.display = 'none';
}

function selectProductOption(element) {
  const container = element.closest('.custom-dropdown');
  const selectedImg = container.querySelector('.product-status-icon');
  selectedImg.src = `/images/${element.dataset.value}`;
  container.querySelector('.dropdown-product-options').style.display = 'none';
}

// 3. 데이터 속성 분리
document.body.addEventListener('click', (e) => {
  const row = e.target.closest('tr.order');
  if(!row) return;

  // 발주 상태 Confirm
  if(e.target.id === 'confirmBtn') {
    row.dataset.orderCurrentSelection = row.dataset.pendingSelection || 'checking.svg';
    updateOrderStatusIcon(row);
    closeModal(row);
  }

  // 발주 상태 Cancel
  if(e.target.id === 'cancelBtn' || e.target.id === 'closeBtn') {
    const orderIcon = row.querySelector('.order-status-icon');
    orderIcon.src = `/images/${row.dataset.orderStatus}`;
    closeModal(row);
  }
});






// 모달 확인 처리
document.body.addEventListener('click', (e) => {
  const row = e.target.closest('tr.order');
  if(!row) return;

  if(e.target.id === 'confirmBtn') {
    // 1. 발주 상태 업데이트
    row.dataset.orderCurrentSelection = row.dataset.pendingSelection || 'checking.svg';
    updateOrderStatusIcon(row);
    
    // 2. 변경 이미지 표시
    const statusImage = document.getElementById('status-change-image');
    statusImage.classList.remove('hidden');
    
    // 3. 부드러운 애니메이션 트리거
    statusImage.classList.remove('hidden', 'visible'); // 초기화
    void statusImage.offsetWidth; // 리플로우 강제 실행
    statusImage.classList.add('visible'); // 애니메이션 시작
    
    // 4. 3초 후 완전히 숨김
    setTimeout(() => {
      statusImage.classList.remove('visible');
      statusImage.classList.add('hidden');
    }, 3000); // 애니메이션 지속시간과 동기화
    
    closeModal(row);
  }
});

// 드롭다운 옵션 클릭 핸들러
function handleOrderOptionClick(event, element) {
  const row = element.closest('tr.order');
  row.dataset.pendingSelection = element.dataset.value;
  
  // 모달 열기
  const modal = row.querySelector('[data-modal-for="delivery"]');
  modal.classList.remove('hidden');
}