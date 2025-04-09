const optionItems = document.querySelectorAll('.option-item-box');

// 각 옵션에 대한 hidden input 설정
const cupQuantityInput = document.querySelector('#cup_quantity');
const cornQuantityInput = document.querySelector('#corn_quantity');
const waffleQuantityInput = document.querySelector('#waffle_quantity');

optionItems.forEach(option => {
    const decreaseButton = option.querySelector('.btn-decrease');
    const increaseButton = option.querySelector('.btn-increase');
    const quantityDisplay = option.querySelector('.quantity');

    // 수량 초기화 함수
    function resetOtherQuantities() {
        optionItems.forEach(item => {
            // 선택되지 않은 옵션의 수량을 초기화
            if (item !== option) {
                const itemQuantity = item.querySelector('.quantity');
                const itemInput = item.querySelector('.quantity-input');  // 'quantity-input' 정확히 찾기
                if (itemQuantity) {
                    itemQuantity.textContent = 1; // 수량 초기화
                }
                if (itemInput) {
                    itemInput.value = 1; // hidden input 수량 초기화
                }
            }
        });
        
        // 이전에 저장된 수량을 초기화
        cupQuantityInput.value = 0;
        cornQuantityInput.value = 0;
        waffleQuantityInput.value = 0;
    }

    // 옵션 선택 시 수량을 초기화하고 hidden input에 반영
    option.addEventListener('click', () => {
        optionItems.forEach(item => item.classList.remove('selected'));
        option.classList.add('selected');

        // 수량 초기화 및 업데이트
        resetOtherQuantities();
        updateQuantity(option);
    });

    // 수량 감소
    decreaseButton.addEventListener('click', function() {
        let quantity = parseInt(quantityDisplay.textContent, 10);
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
            updateQuantity(option); // 수량 변경 시 hidden input에 반영
        }
    });

    // 수량 증가
    increaseButton.addEventListener('click', function() {
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
    }
});

document.querySelector('.btn-choose').addEventListener('click', function() {
    // 각 옵션의 수량 값을 가져옴
    const quantities = {
        cup_quantity: document.querySelector('#cup_quantity').value,
        corn_quantity: document.querySelector('#corn_quantity').value,
        waffle_quantity: document.querySelector('#waffle_quantity').value
    };

    // URL 파라미터로 수량을 추가
    const urlParams = new URLSearchParams(quantities).toString();

    // 수량 값을 URL 파라미터로 전달하여 페이지 이동
    let url = '../BR.3_flavor_sy/flavor.js?' + urlParams;
    window.location.href = url;
});
const params = new URLSearchParams(window.location.search);
const name = params.get('productName');

// 요소 가져오기
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productOption = document.getElementById('product-option');
const optionImgContainer = document.getElementById('option-img-container'); // 옵션 이미지 넣을 곳

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

// 🛠 여기 추가! name에 맞는 product 찾기
const product = products.find(p => p.name === name);

if (product) {
  // 제품명, 가격, 옵션 텍스트 설정
  if (productName) productName.textContent = product.name;
  if (productPrice) productPrice.textContent = product.price;
  if (productOption) productOption.textContent = product.option;

  // 옵션 이미지 넣기
  if (optionImgContainer) {
    optionImgContainer.innerHTML = ''; // 기존 이미지 비우기

    const optionText = product.option;
    const imgList = [];

    if (optionText.includes('콘')) {
      const cornImg = document.createElement('img');
      cornImg.src = 'images/corn.png';
      cornImg.alt = '콘';
      cornImg.classList.add('corn-img');
      imgList.push(cornImg);
    }

    if (optionText.includes('컵')) {
      const cupImg = document.createElement('img');
      cupImg.src = 'images/cup.png';
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
  }
} else {
  console.error('해당하는 상품을 찾을 수 없습니다:', name);
}
