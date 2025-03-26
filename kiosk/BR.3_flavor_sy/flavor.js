const flavors = Array.from(document.querySelectorAll('.flavor-item'));
const grid = document.querySelector('.flavor-grid');
const itemsPerPage = 4 * 3;
let totalPages = Math.ceil(flavors.length / itemsPerPage);
let currentPage = 0;

function showCurrentPage() {
  flavors.forEach((item, idx) => {
    if (Math.floor(idx / itemsPerPage) === currentPage) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

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

document.addEventListener("DOMContentLoaded", () => {
  // 선택 슬롯 수
  const selectedCount = 4; // 필요 시 3으로 변경
  let currentSlot = 0;
  let selectedFlavors = new Array(selectedCount).fill(null);

  const flavorItems = document.querySelectorAll('.flavor-item');
  totalPages = Math.ceil(flavorItems.length / itemsPerPage);

  showCurrentPage();
  updateArrowsAndDots();

  document.querySelector('.arrow.right').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      showCurrentPage();
      updateArrowsAndDots();
    }
  });

  document.getElementById('confirm-button').addEventListener('click', () => {
    const selectedValid = selectedFlavors.filter(f => f !== null);
    if (selectedValid.length === selectedCount) {
      location.href = '../BR.1_menu_hb/menu.html';
    } else {
      alert(`플레이버를 ${selectedCount}개 선택해주세요.`);
    }
  });
  

  document.querySelector('.arrow.left').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      showCurrentPage();
      updateArrowsAndDots();
    }
  });

  function updateSelectionUI() {
    const listContainer = document.querySelector('.selected-flavor');
    listContainer.innerHTML = '';

    selectedFlavors.forEach((flavor, index) => {
      const flavorDiv = document.createElement('div');
    flavorDiv.classList.add('selected-item');
    flavorDiv.innerHTML = `
      <img src="${flavor.imgSrc}" alt="${flavor.name}">
      <p>${flavor.name}</p>
    `;
    // 클릭 시 해당 항목 삭제
    flavorDiv.addEventListener('click', () => {
      selectedFlavors.splice(index, 1);
      currentSlot--;
      updateSelectionUI();
    });

    listContainer.appendChild(flavorDiv);
  });
}

  function onFlavorItemClick(e) {
    const flavorItem = e.currentTarget;
    const imgSrc = flavorItem.querySelector('img').src;
    const flavorName = flavorItem.querySelector('p').innerText;

    // 중복 선택 허용
    if (currentSlot < selectedCount) {
      selectedFlavors[currentSlot] = { imgSrc, name: flavorName };
      currentSlot++;
    } else {
      alert(`최대 ${selectedCount}개까지 선택 가능합니다.`);
    }

    updateSelectionUI();
  }

  flavorItems.forEach(item => {
    item.addEventListener('click', onFlavorItemClick);
  });

  updateSelectionUI();
});
s