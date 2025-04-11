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
