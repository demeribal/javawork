const optionItems = document.querySelectorAll('.option-item-box');

// 각 옵션에 대한 hidden input 설정
const cupQuantityInput = document.querySelector('#cup_quantity');
const cornQuantityInput = document.querySelector('#corn_quantity');
const waffleQuantityInput = document.querySelector('#waffle_quantity');

const optionBox = document.querySelector(".option-item-box");
const nextBtn = document.querySelector(".btn-choose");


nextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (nextBtn.classList.contains("disabled")) {
    alert("옵션 / 수량을 선택해 주세요");
  } else {
    location.href = '/kiosk/BR.3_flavor_sy/flavor.html';
  }
});



function checkActive() {
  const isActive = Array.from(optionItems).some(item => item.classList.contains("active")
  );

  if (isActive) {
    nextBtn.classList.remove("disabled");
    nextBtn.classList.add("enabled");
  } else {
    nextBtn.classList.add("disabled");
    nextBtn.classList.remove("enabled");
  }
}
// 옵션 클릭하면 활성화
optionItems.forEach(option => {
  option.addEventListener("click", () => {
    option.classList.add("active");
    checkActive();
  });
});


// 페이지 로드시 비활성화
window.addEventListener("DOMContentLoaded", () => {
  nextBtn.classList.add("disabled");
});

function updateNextButtonState() {
  let selected = false;
  optionItems.forEach(option => {
    const quantity = parseInt(option.querySelector('.quantity').textContent, 10);
    if (quantity > 0) {
      selected = true;
    }
  });
  
  if (selected) {
    nextBtn.disabled = false;
    nextBtn.classList.remove('disabled'); // 필요하면 클래스 조정
  } else {
    nextBtn.disabled = true;
    nextBtn.classList.add('disabled'); // 필요하면 스타일 조정
  }
}

// html 요소 가져오기
const productNameEl = document.getElementById('product-name');
const productPriceEl = document.getElementById('product-price');
const productOptionEl = document.getElementById('product-option');
const optionImgContainer = document.getElementById('option-img-container'); 
const guideTextEl = document.getElementById('menu-guide');

document.addEventListener("DOMContentLoaded", function() {
  const products = [
    { name: '싱글레귤러', price: '₩3,200', option: '(콘/컵)' },
    { name: '싱글킹', price: '₩4,000', option: '(콘/컵)' },
    { name: '더블주니어', price: '₩4,300', option: '(콘/컵)' },
    { name: '더블레귤러', price: '₩6,200', option: '(콘/컵)' },
    { name: '파인트', price: '₩8,200', option: '(컵)' },
    { name: '쿼터', price: '₩15,500', option: '(컵)' },
    { name: '패밀리', price: '₩22,000', option: '(컵)' },
    { name: '하프갤런', price: '₩26,500', option: '(컵)' }
  ];
  //세션에서 가져옴
  const tempProductData = JSON.parse(sessionStorage.getItem('tempProductData'));
  const selectedProductName = tempProductData[0]?.name;
  //세션에서 가져온 이름으로 비교해 정보 찾기
  const selectedProduct = products.find(product => product.name === selectedProductName);

  if (selectedProduct) {
    if (productNameEl) productNameEl.textContent = selectedProduct.name;
    if (productPriceEl) productPriceEl.textContent = selectedProduct.price;
    if (productOptionEl) productOptionEl.textContent = selectedProduct.option;

    if (guideTextEl) guideTextEl.textContent = `원하는 맛의 아이스크림을 ${selectedProduct.name}으로 즐기세요!`;

    // 옵션 이미지 넣기
    if (optionImgContainer) {
      optionImgContainer.innerHTML = ''; // 기존 이미지 비우기
  
      const guideTextEl = selectedProduct.option;
      const imgList = [];
  
      if (guideTextEl.includes('콘')) {
        const cornImg = document.createElement('img');
        cornImg.src = '/kiosk/BR.2_count_sm/images/corn.png';
        cornImg.alt = '콘';
        cornImg.classList.add('corn-img');
        imgList.push(cornImg);
      }
  
      if (guideTextEl.includes('컵')) {
        const cupImg = document.createElement('img');
        cupImg.src = '/kiosk/BR.2_count_sm/images/cup.png';
        cupImg.alt = '컵';
        cupImg.classList.add('cup-img');
        imgList.push(cupImg);
      }
  
      if (imgList.length === 1) {
          optionImgContainer.classList.add('single-img');
        
          // 이미지가 하나고 그게 컵 이미지면 회전 없애기
          if (imgList[0].classList.contains('cup-img')) {
            imgList[0].style.transform = 'none'; // 회전 취소
          }
        } else {
          optionImgContainer.classList.remove('single-img');
        }
  
      imgList.forEach((img) => {
        optionImgContainer.appendChild(img);
      });
  
      const optionInfo = document.querySelector('.option-info');
      if (optionInfo) {
        if (guideTextEl === '(컵)') {
          optionInfo.style.visibility = 'hidden';
        } else {
          optionInfo.style.visibility = 'visible';
        }
      }
  
      // 옵션 아이템 처리
      const cupOption = document.getElementById('cup-option');
      const cornOption = document.getElementById('corn-option');
      const waffleOption = document.getElementById('waffle-option');
  
      if (guideTextEl === '(컵)') {
        // 컵만 있으면 콘/와플 숨기기
        if (cornOption) cornOption.parentElement.style.display = 'none';
        if (waffleOption) waffleOption.parentElement.style.display = 'none';
        
        if (cupOption) {
          cupOption.parentElement.style.display = 'flex';
          cupOption.parentElement.style.justifyContent = 'center';
        }
        const cupName = cupOption.querySelector('.option-name');
        if (cupName) {
          cupName.textContent = '컵';
        }
      } else {
        // 콘이나 와플콘도 선택지에 있으면 다 보이게
        if (cornOption) cornOption.parentElement.style.display = 'flex';
        if (waffleOption) waffleOption.parentElement.style.display = 'flex';
        if (cupOption) cupOption.parentElement.style.display = 'flex';
      }
  
      
    }
  }


})
  //-+ 비활성

  


  
optionItems.forEach(option => {
  const decreaseButton = option.querySelector('.btn-decrease');
  const increaseButton = option.querySelector('.btn-increase');
  //const quantity = option.querySelector(".quantity");

  // 수량 초기화 함수
  function resetOtherQuantities() {
      optionItems.forEach(item => {
        const decreaseButton = item.querySelector('.btn-decrease');
        const increaseButton = item.querySelector('.btn-increase');
        // 선택되지 않은 옵션의 수량을 초기화
        if (item !== option) {
          
            const itemQuantity = item.querySelector('.quantity');
            const itemInput = item.querySelector('.quantity-input'); 
            decreaseButton.style.visibility = 'hidden';
            increaseButton.style.visibility = 'hidden';
            if (itemQuantity) {
                itemQuantity.textContent = 0; // 수량 초기화
            }
            if (itemInput) {
                itemInput.value = 0; // hidden input 수량 초기화
            }
          }
      });
      
      // 이전에 저장된 수량을 초기화
      cupQuantityInput.value = 0;
      cornQuantityInput.value = 0;
      waffleQuantityInput.value = 0;
      
  }

 
  option.addEventListener('click', () => {
    // 버튼을 해당 option에서 찾아서 보이게 처리
    const decreaseButton = option.querySelector('.btn-decrease');
    const increaseButton = option.querySelector('.btn-increase');
    
    // - + 버튼 보이기
    decreaseButton.style.visibility = 'visible';
    increaseButton.style.visibility = 'visible';
  
    // 다른 옵션 선택 해제
    optionItems.forEach(item => item.classList.remove('selected'));
    option.classList.add('selected');
  
    // 다른 옵션 수량 초기화
    resetOtherQuantities();
  
    // 수량을 1로 설정
    const quantityDisplay = option.querySelector('.quantity');
    if (parseInt(quantityDisplay.textContent, 10) === 0) {
      quantityDisplay.textContent = '1';
    }
  
    // hidden input 반영
    updateQuantity(option);
  });
  
  // 수량 감소
  decreaseButton.addEventListener('click', function() {
    const quantityDisplay = option.querySelector('.quantity');
    let quantity = parseInt(quantityDisplay.textContent, 10);
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
      updateQuantity(option); // 수량 변경 시 hidden input에 반영
    }
  });
  
  // 수량 증가
  increaseButton.addEventListener('click', function() {
    const quantityDisplay = option.querySelector('.quantity');
    let quantity = parseInt(quantityDisplay.textContent, 10);
    quantity++;
    quantityDisplay.textContent = quantity;
    updateQuantity(option); // 수량 변경 시 hidden input에 반영
  });
  
  // 수량을 hidden input에 반영하는 함수
  function updateQuantity(option) {
    const quantity = parseInt(option.querySelector('.quantity').textContent, 10);
  
    // 각 옵션에 맞는 hidden input에 수량을 반영
    if (option.id === 'cup-option') {
      cupQuantityInput.value = quantity > 0 ? quantity : 0;
    } else if (option.id === 'corn-option') {
      cornQuantityInput.value = quantity > 0 ? quantity : 0;
    } else if (option.id === 'waffle-option') {
      waffleQuantityInput.value = quantity > 0 ? quantity : 0;
    }
  
    // 디버깅을 위한 로그
    console.log('cup:', cupQuantityInput.value);
    console.log('corn:', cornQuantityInput.value);
    console.log('waffle:', waffleQuantityInput.value);
    updateProductData();
  }
  
});

function addSessionProductData() {
  const tempProductData = JSON.parse(sessionStorage.getItem('tempProductData'));

  // tempProductData의 각 항목을 초기 상태로 덮어쓰기
  const addData = tempProductData.map(item => ({
      ...item,
      option: "",
      quantity: 0,
      totalPrice: 0
  }));

  sessionStorage.setItem('tempProductData', JSON.stringify(addData));
}
addSessionProductData();
function updateProductData() {
  let tempProductData = JSON.parse(sessionStorage.getItem('tempProductData')) || [];

  const cupQuantity = parseInt(cupQuantityInput.value, 10);
  const cornQuantity = parseInt(cornQuantityInput.value, 10);
  const waffleQuantity = parseInt(waffleQuantityInput.value, 10);

  // 첫 번째 제품 선택 (예시)
  const selectedProduct = tempProductData[0] || {}; // 첫 번째 제품 예시, 필요에 따라 인덱스 변경

  if (cupQuantity > 0) {
    selectedProduct.option = 'cup';
    selectedProduct.quantity = cupQuantity;
  } else if (cornQuantity > 0) {
    selectedProduct.option = 'corn';
    selectedProduct.quantity = cornQuantity;
  } else if (waffleQuantity > 0) {
    selectedProduct.option = 'waffle';
    selectedProduct.quantity = waffleQuantity;
  }

  // 수량이 0이 아닌 경우에만 세션 데이터에 반영
  if (selectedProduct.quantity > 0) {
    selectedProduct.totalPrice = selectedProduct.unitPrice * selectedProduct.quantity; // 총 가격 업데이트

    // 세션에 업데이트된 데이터 저장
    //tempProductData[0] = selectedProduct; // 첫 번째 제품에만 업데이트
    sessionStorage.setItem('tempProductData', JSON.stringify(tempProductData));
  }

  console.log('Updated tempProductData:', tempProductData); // 디버깅 메시지 추가
}



function goBack() {
  sessionStorage.removeItem("tempProductData");
  window.location.href = "/kiosk/BR.1_menu_hb/menu.html";
}



/*

document.querySelector('.btn-choose').addEventListener('click', function() {
  // 각 옵션의 수량 값을 가져옴
  const quantities = {
      cup_quantity: document.querySelector('#cup_quantity').value,
      corn_quantity: document.querySelector('#corn_quantity').value,
      waffle_quantity: document.querySelector('#waffle_quantity').value
  };

  // 수량 정보를 sessionStorage에 저장
  sessionStorage.setItem('quantities', JSON.stringify(quantities));

    // 💡 이미 선언된 selectedProduct 재사용!
    if (!selectedProduct) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }
  
    // "₩3,200" → 3200 숫자로 변환
    const unitPrice = parseInt(selectedProduct.price.replace(/₩|,/g, ''), 10);
  
    let quantity = 0;
    if (quantities.cup_quantity > 0) quantity = quantities.cup_quantity;
    else if (quantities.corn_quantity > 0) quantity = quantities.corn_quantity;
    else if (quantities.waffle_quantity > 0) quantity = quantities.waffle_quantity;
  
    const productData = JSON.parse(sessionStorage.getItem('productData')) || [];
    productData.push({
      name: selectedProduct.name,
      unitPrice,
      quantity,
      totalPrice: unitPrice * quantity
    });
    sessionStorage.setItem('productData', JSON.stringify(productData));

  //다음 페이지 이동
  let url = '../BR.3_flavor_sy/flavor.html';
  window.location.href = url;
});*/
