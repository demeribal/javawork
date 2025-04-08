//--0.URL 파라미터로부터 제품 정보 추출
function getSelectedProductsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const productTypes = [
    { name: 'cup', flavorsRequired: 2 },
    { name: 'corn', flavorsRequired: 3 },
    { name: 'waffle', flavorsRequired: 4 }
  ];

  const selectedProducts = [];
  productTypes.forEach(type => {
    const quantity = parseInt(params.get(`${type.name}_quantity`)) || 0;
    for (let i = 0; i < quantity; i++) {
      selectedProducts.push(type); // flavorsRequired 포함된 객체로 push
    }
  });

  return selectedProducts;
}

//--1.초기 페이지 설정
const itemsPerPage = 4 * 3;
let flavors = [];
let totalPages;
let currentPage = 0;

//--2.현재 페이지에 있는 항목만 보이도로 설정
function showCurrentPage() {
  flavors.forEach((item, idx) => {
    if (Math.floor(idx / itemsPerPage) === currentPage) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

//--3.화살표와 도트 업데이터 함수
function updateArrowsAndDots() {
  const leftArrow = document.querySelector('.arrow.left');
  const rightArrow = document.querySelector('.arrow.right');

  leftArrow.style.display = currentPage === 0 ? 'none' : 'flex';
  rightArrow.style.display = currentPage === totalPages - 1 ? 'none' : 'flex';

  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentPage);
  });
}

//--4.플레이버 선택
document.addEventListener("DOMContentLoaded", () => {
  const flavorItems = Array.from(document.querySelectorAll('.flavor-item'));
  flavors = flavorItems;

  totalPages = Math.ceil(flavors.length / itemsPerPage);
  showCurrentPage();
  updateArrowsAndDots();

  const selectedProducts = getSelectedProductsFromURL(); //파라미터로 데이터 추출

  let currentSlotIndex = 0;
  let selectedFlavorsBySlot = new Array(selectedProducts.length).fill(null).map(() => []);
  
  const selectedFlavorArea = document.querySelector('.selected-flavor');
  const confirmButton = document.getElementById('confirm-button');

  const slotArrow = document.createElement('div');
  slotArrow.classList.add('slot-arrow');

  const selectionArea = document.querySelector('.selection-area');
  selectionArea.appendChild(slotArrow);

  //슬롯 화살표 위치 함수
  function updateSlotArrowPosition() {
    const slots = document.querySelectorAll('.slot');
    const currentSlot = slots[currentSlotIndex];
    if (currentSlot) {
      const offsetLeft = currentSlot.offsetLeft + currentSlot.offsetWidth / 2 - 8;
      slotArrow.style.left = offsetLeft + 'px';
    }
  }   

  createSlots();

  function createSlots() {
    const slotsContainer = document.querySelector('.circle-slots');
    slotsContainer.innerHTML = ''; // 기존 슬롯들 제거
  
    selectedProducts.forEach((product, index) => {
      const slot = document.createElement('div');
      slot.classList.add('slot');
      slot.dataset.index = index;
  
      const slotBox = document.createElement('div');
      slotBox.classList.add('slot-box');
  
      const count = document.createElement('span');
      count.classList.add('slot-count');
      count.innerText = product.flavorsRequired;
  
      slot.appendChild(slotBox);
      slot.appendChild(count);
      slotsContainer.appendChild(slot);
    });
  
    updateSlotArrowPosition();
  }

  updateSelectionUI();

  //--5.오른쪽 화살표 클릭 시 페이지 전환
  document.querySelector('.arrow.right').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      showCurrentPage();
      updateArrowsAndDots();
    }
  });

  //--6.다음 버튼 클릭 시 선택된 맛, 항목 확인
  confirmButton.addEventListener('click', () => {
    const allSelected = selectedFlavorsBySlot.length === selectedProducts.length &&
      selectedFlavorsBySlot.every(
      (slot, i) => slot.length === selectedProducts[i].flavorsRequired
      );

    if (!allSelected) {
      alert("모든 플레이버를 선택해주세요."); // ❗️ 여기서 알림
      return;
    }

    // 선택 완료 시 이동
    location.href = '../BR.1_menu_hb/menu.html';
  });
  
  
  //--7.왼쪽 화살표 클릭 시 페이지 전환
  document.querySelector('.arrow.left').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      showCurrentPage();
      updateArrowsAndDots();
    }
  });
  
  //--8.선택된 항목을 UI에 업데이트
  function updateSelectionUI() {
    selectedFlavorArea.innerHTML = '';
  
    const currentFlavors = selectedFlavorsBySlot[currentSlotIndex];
    currentFlavors.forEach((flavor, index) => {
      const div = document.createElement('div');
      div.classList.add('selected-item');
      div.innerHTML = 
        '<img src="' + flavor.imgSrc + '" alt="' + flavor.name + '">' +
        '<p>' + flavor.name + '</p>';
  
      div.addEventListener('click', () => {
        selectedFlavorsBySlot[currentSlotIndex].splice(index, 1);
        updateSelectionUI();
      });
  
      selectedFlavorArea.appendChild(div);
    });
  
    const allSelected = selectedFlavorsBySlot.length === selectedProducts.length &&
      selectedFlavorsBySlot.every((slot, i) => slot.length === selectedProducts[i].flavorsRequired);
  
    // 현재 슬롯 위치로 화살표 이동
    updateSlotArrowPosition();
  }
  

  //--9.맛 항목 선택 시 처리 함수
  function onFlavorItemClick(e) {
    const item = e.currentTarget;
    const imgSrc = item.querySelector('img').src;
    const flavorName = item.querySelector('p').innerText;
  
    const currentProduct = selectedProducts[currentSlotIndex];
    const currentFlavors = selectedFlavorsBySlot[currentSlotIndex];
  
    // 현재 슬롯에서 선택한 개수 초과면 막기
    if (currentFlavors.length >= currentProduct.flavorsRequired) return;
  
    // 현재 슬롯에 추가
    currentFlavors.push({ imgSrc, name: flavorName });
  
    updateSelectionUI();
  
    // 선택 완료됐으면 다음 슬롯으로 이동
    if (currentFlavors.length === currentProduct.flavorsRequired &&
      currentSlotIndex < selectedProducts.length - 1) {

      setTimeout(() => {
        currentSlotIndex++;
        updateSelectionUI();
    }, 400);
    }
  }  

  //--10.맛 항목 클릭 시 이벤트 리스너 추가
  flavorItems.forEach(item => {
    item.addEventListener('click', onFlavorItemClick);
  });

  //--11.페이지 로드 시 선택항목 UI 업데이트
  updateSelectionUI();
});