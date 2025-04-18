//--1.초기 페이지 설정
const itemsPerPage = 4 * 3;
let flavors = [];
let totalPages;
let currentPage = 0;
let selectedProducts = [];
let selectedFlavorsBySlot = [];
let currentSlotIndex = 0;
let slotArrow;

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

  createDots(); // dot 재렌더링
}

//--4.맛 항목 선택 시 처리 함수
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
/*
  // 선택 완료됐으면 다음 슬롯으로 이동
  if (currentFlavors.length === currentProduct.flavorsRequired &&
    currentSlotIndex < selectedProducts.length) {

    setTimeout(() => {
      currentSlotIndex++;
      updateSelectionUI();
  }, 400);
  }
  if(currentFlavors.length === currentProduct.flavorsRequired &&
    currentSlotIndex < selectedProducts.length-1){
    
  }*/

    const tempProductData = JSON.parse(sessionStorage.getItem('tempProductData')) || [];
    const imageUrl = tempProductData[0]?.imageUrl;
    
    if (currentFlavors.length === currentProduct.flavorsRequired) {
      const slotBoxes = document.querySelectorAll('.slot-box');
      const currentBox = slotBoxes[currentSlotIndex];
    
      if (imageUrl && currentBox && !currentBox.querySelector('img')) {
        const img = document.createElement('img');
        img.src = imageUrl; 
        img.alt = "상품 이미지"; 
        img.classList.add('slot-image');
        currentBox.appendChild(img);
      }
    
      // 마지막 슬롯이 아니면 다음 슬롯으로 이동
      if (currentSlotIndex < selectedProducts.length - 1) {
        setTimeout(() => {
          currentSlotIndex++;
          updateSelectionUI();
        }, 400);
      }
    }

    
} 

  //슬롯 화살표 위치 함수
  function updateSlotArrowPosition() {
    const slots = document.querySelectorAll('.slot');
    const currentSlot = slots[currentSlotIndex];
    const slotsContainer = document.querySelector('.circle-slots');
  
    if (currentSlot && slotsContainer && slotArrow) {
      const containerRect = slotsContainer.getBoundingClientRect();
      const slotRect = currentSlot.getBoundingClientRect();
      const centerX = slotRect.left + slotRect.width / 2 - containerRect.left;
      // 가운데로 정렬 (8은 삼각형 너비 보정)
      slotArrow.style.left = `${centerX - 8}px`; 

    slots.forEach(slot => slot.classList.remove('active-slot'));
    currentSlot.classList.add('active-slot');
    }
  }
  

//--5.선택된 항목을 UI에 업데이트
function updateSelectionUI() {
  selectedFlavorArea.innerHTML = '';

  const currentFlavors = selectedFlavorsBySlot[currentSlotIndex];
  currentFlavors.forEach((flavor, index) => {
    div = document.createElement('div');
    div.classList.add('selected-item');
    div.innerHTML = 
      '<img src="' + flavor.imgSrc + '" alt="' + flavor.name + '">' +
      '<p>' + flavor.name + '</p>';

    div.addEventListener('click', () => {
      selectedFlavorsBySlot[currentSlotIndex].splice(index, 1);
      updateSelectionUI();

      // 선택 개수에 따라 slot-image 추가/제거
      const slotBoxes = document.querySelectorAll('.slot-box');
      const currentBox = slotBoxes[currentSlotIndex];
      const currentProduct = selectedProducts[currentSlotIndex];
      const tempProductData = JSON.parse(sessionStorage.getItem('tempProductData')) || [];
      const imageUrl = tempProductData[0]?.imageUrl;

      if (currentBox) {
        const existingImage = currentBox.querySelector('.slot-image');
        if (currentFlavors.length === currentProduct.flavorsRequired) {
          if (!existingImage && imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = "상품 이미지";
            img.classList.add('slot-image');
            currentBox.appendChild(img);
          }
        } else {
          if (existingImage) {
            existingImage.remove();
          }
        }
      }

    });
    selectedFlavorArea.appendChild(div);
  });

  const allSelected = selectedFlavorsBySlot.length === selectedProducts.length &&
    selectedFlavorsBySlot.every((slot, i) => slot.length === selectedProducts[i].flavorsRequired);

  // 현재 슬롯 위치로 화살표 이동
  updateSlotArrowPosition();
}
  
//--6.플레이버 선택
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('.circle-slots').addEventListener('scroll', () => {
    updateSlotArrowPosition();
  });

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
  
      // 슬롯 클릭 시 해당 슬롯으로 이동
      slot.addEventListener('click', () => {
        currentSlotIndex = index;
        updateSelectionUI();
      });
  
      slot.appendChild(slotBox);
      slot.appendChild(count);
      slotsContainer.appendChild(slot);
    });
    onFlavorItemClick();
    updateSlotArrowPosition();  // 화살표 위치 업데이트
  }

  const flavorPerProduct = {
    '싱글레귤러': 1,
    '싱글킹': 1,
    '더블주니어': 2,
    '더블레귤러': 2,
    '파인트': 3,
    '쿼터': 4,
    '패밀리': 5,
    '하프갤런': 6
  };

//수미
//세션에서 데이터 불러옴
const tempProductData = JSON.parse(sessionStorage.getItem('tempProductData') || '{}'); 

//tempProductData name과 수량 추출
tempProductData.forEach(product => {
  const productName = product.name;
  const productQuantity = parseInt(product.quantity) || 0;
  const flavorsRequired = flavorPerProduct[productName] || 1;

  selectedProducts= new Array(productQuantity).fill({
    name: productName,
    flavorsRequired: flavorsRequired
  });

  currentSlotIndex = 0;
  selectedFlavorsBySlot = new Array(selectedProducts.length).fill(null).map(() => []);

  selectedFlavorArea = document.querySelector('.selected-flavor');
  const confirmButton = document.getElementById('confirm-button');

  slotArrow = document.createElement('div');
  slotArrow.classList.add('slot-arrow');

  const selectionArea = document.querySelector('.selection-area');
  selectionArea.appendChild(slotArrow);

    //--7.오른쪽 화살표 클릭 시 페이지 전환
    document.querySelector('.arrow.right').addEventListener('click', () => {
      if (currentPage < totalPages - 1) {
        currentPage++;
        showCurrentPage();
        updateArrowsAndDots();
      }
    });
  
    //--7.다음 버튼 클릭 시 선택된 맛, 항목 확인
    confirmButton.addEventListener('click', () => {
      const allSelected = selectedFlavorsBySlot.length === selectedProducts.length &&
        selectedFlavorsBySlot.every(
        (slot, i) => slot.length === selectedProducts[i].flavorsRequired
        );
  
      if (!allSelected) {
        alert("모든 플레이버를 선택해주세요."); 
        return;

        
      }

  //세션 저장
  tempProductData.forEach((product, index) => {
    // 해당 제품의 수량만큼 선택된 맛을 `selectedFlavorsBySlot`에서 추출
    const flavorsForProduct = selectedFlavorsBySlot.slice(index * product.quantity, (index + 1) * product.quantity);

    // 각 제품에 flavors 정보를 추가
    product.flavors = flavorsForProduct.map(slot => slot.map(f => f.name));
  });

  // (3) 세션에 저장하고 페이지 이동
  setTimeout(() => {
    sessionStorage.setItem('tempProductData', JSON.stringify({
      products: tempProductData  // 제품 데이터 그대로 저장, flavors가 추가된 상태// 수량 정보도 함께 저장
    }));

    // 페이지 이동
      location.href = '../BR.1_menu_hb/menu.html';
    }, 100);
  });
  
  //--9.왼쪽 화살표 클릭 시 페이지 전환
  document.querySelector('.arrow.left').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      showCurrentPage();
      updateArrowsAndDots();
    }
  });
  
});

  //--10. menuAPI fetch
  fetch("http://tomhoon.duckdns.org:8882/api/menus")
  // API 주소 확인
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("flavorGrid");
      flavors = [];
      
      data.forEach(menu => {
        const item = document.createElement("div");
        item.className = "flavor-item";

      const serverURL = 'http://tomhoon.duckdns.org:8882';
      
      const encodedImagePath = encodeURI(menu.imagePath);
      item.innerHTML = `
        <img src="${serverURL + encodedImagePath}" alt="${menu.menuName}">
        <p>${menu.menuName}</p>
      `;      

        item.addEventListener("click", onFlavorItemClick);
        grid.appendChild(item);
        flavors.push(item);
      });

      totalPages = Math.ceil(flavors.length / itemsPerPage);
      createDots();
      showCurrentPage();
      updateArrowsAndDots();

      createSlots();
      updateSelectionUI(); 
    })
    .catch(err => console.error("플레이버 로딩 실패:", err));
});



//--11. 동적으로 dot 생성
function createDots() {
  const dotContainer = document.querySelector('.indicator-dots');
  dotContainer.innerHTML = ''; // 기존 dot 제거

  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === currentPage) dot.classList.add('active');

    dot.addEventListener('click', () => {
      currentPage = i;
      showCurrentPage();
      updateArrowsAndDots();
    });

    dotContainer.appendChild(dot);
  }
}


