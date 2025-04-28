// 세션 스토리지에서 데이터 가져오기
let productData = JSON.parse(sessionStorage.getItem('productData')) || [];
let priceData = JSON.parse(sessionStorage.getItem('priceData')) || {
    totalAmount: 0, 
    discountAmount: 0, 
    paymentPrice: 0
};

// 옵션 코드를 한글 이름으로 변환하는 함수
function getOptionName(optionCode) {
    const options = {
        "cup": "컵",
        "corn": "콘",
        "waffle": "와플콘"
    };
    return options[optionCode] || optionCode;
}

// 상품 목록 렌더링 함수
function renderProductList() {
    const itemlist = document.querySelector('.item-list');
    itemlist.innerHTML = ''; // 목록 초기화
    
    productData.forEach((product, productIndex) => {
        const option = getOptionName(product.option);
        const imageUrl = product.imageUrl;
        //imageUrl.substring(imageUrl.search('kiosk'));
        
        for (let i = 0; i < product.quantity; i++) {
            // 맛 정보 가져오기
            let flavorText = '';
            if (product.flavors && product.flavors[i]) {
                // 맛은 2차원 배열로 저장되어 있음
                if (Array.isArray(product.flavors[i])) {
                    flavorText = product.flavors[i].join(', ');
                } else {
                    flavorText = product.flavors[i];
                }
            }
            
            const item = document.createElement('div');
            item.className = `item ${product.option} ${product.name}`;
            item.dataset.productIndex = productIndex;
            item.dataset.itemIndex = i;
            
            item.innerHTML = `
                <div class="item-image" style="background-image: url('${imageUrl}')"></div>
                <div class="item-details">
                    <div class="item-name">${product.name}</div>
                    <div class="item-option">(콘/컵) ${option}(포장불가)</div>
                    <div class="item-flavor">${flavorText}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity">1</span>
                    <button class="quantity-btn increase">+</button>
                </div>
                <div class="item-actions">
                    <button class="edit-btn">
                        <img src="images/edit-btn.png" alt="수정">
                    </button>
                    <button class="delete-btn">
                        <img src="images/delete-btn.png" alt="삭제">
                    </button>
                </div>
            `;
            
            itemlist.appendChild(item);
        }
    });
    
    // 이벤트 리스너 추가
    addEventListeners();
}




// 주문 내역이 있는지 확인하는 함수
function hasOrderItems() {
    return productData && productData.length > 0;
}

// 결제 옵션 클릭 이벤트 핸들러 수정
function setupPaymentOptions() {
    const cashOption = document.querySelector('.cash-option');
    const cardOption = document.querySelector('.card-option');
    
    if (cashOption) {
        cashOption.addEventListener('click', () => {
            if (!hasOrderItems()) {
                alert('주문 내역이 없습니다. 상품페이지로 넘어갑니다.');
                location.href = '../BR.1_menu_hb/menu.html';
                return;
            }
            location.href = '../BR.5_point_hm/point.html';
        });
    }
    
    if (cardOption) {
        cardOption.addEventListener('click', () => {
            if (!hasOrderItems()) {
                alert('주문 내역이 없습니다. 상품페이지로 넘어갑니다.');
                location.href = '../BR.1_menu_hb/menu.html';
                return;
            }
            location.href = '../BR.5_point_hm/point.html';
        });
    }
}

// 초기 렌더링 시 호출
function initialize() {
    renderProductList();
    updateTotalPriceDisplay();
    setupPaymentOptions();
    
    // 주문 내역이 없으면 안내 메시지 표시
    if (!hasOrderItems()) {
        const itemList = document.querySelector('.item-list');
        itemList.innerHTML = `
            <div class="empty-cart-message">
                <div class="empty-cart-icon">🛒</div>
                <p>주문 내역이 없습니다</p>
                <button class="go-to-menu-btn">메뉴 선택하러 가기</button>
            </div>
        `;
        
        // 메뉴 페이지로 이동하는 버튼 이벤트
        document.querySelector('.go-to-menu-btn')?.addEventListener('click', () => {
            location.href = '../BR.1_menu_hb/menu.html';
        });
    }
}

// 페이지 로드 시 초기화
initialize();






// 이벤트 리스너 추가 함수
function addEventListeners() {
    // 수량 감소 버튼
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.item');
            const productIndex = parseInt(item.dataset.productIndex);
            const itemIndex = parseInt(item.dataset.itemIndex);
            
            // 수량이 1보다 크면 감소
            if (productData[productIndex].quantity > 1) {
                productData[productIndex].quantity -= 1;
                productData[productIndex].totalPrice = productData[productIndex].unitPrice * productData[productIndex].quantity;
                
                // 맛 배열에서 해당 아이템 제거
                if (productData[productIndex].flavors && productData[productIndex].flavors.length > itemIndex) {
                    productData[productIndex].flavors.splice(itemIndex, 1);
                }
                
                // 세션 스토리지 업데이트 및 화면 다시 렌더링
                updateSessionStorage();
                updateTotalAmount();
                renderProductList();
            }
        });
    });
    
    // 수량 증가 버튼
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.item');
            const productIndex = parseInt(item.dataset.productIndex);
            
            // 수량 증가
            productData[productIndex].quantity += 1;
            productData[productIndex].totalPrice = productData[productIndex].unitPrice * productData[productIndex].quantity;
            
            // 맛 배열에 기본 맛 추가 (첫 번째 맛 복제)
            if (productData[productIndex].flavors && productData[productIndex].flavors.length > 0) {
                productData[productIndex].flavors.push([...productData[productIndex].flavors[0]]);
            }
            
            // 세션 스토리지 업데이트 및 화면 다시 렌더링
            updateSessionStorage();
            updateTotalAmount();
            renderProductList();
        });
    });
    
    // 삭제 버튼
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.item');
            const productIndex = parseInt(item.dataset.productIndex);
            const itemIndex = parseInt(item.dataset.itemIndex);
            
            // 해당 아이템만 삭제 (수량 1 감소)
            if (productData[productIndex].quantity > 1) {
                productData[productIndex].quantity -= 1;
                productData[productIndex].totalPrice = productData[productIndex].unitPrice * productData[productIndex].quantity;
                
                // 맛 배열에서 해당 아이템 제거
                if (productData[productIndex].flavors && productData[productIndex].flavors.length > itemIndex) {
                    productData[productIndex].flavors.splice(itemIndex, 1);
                }
            } else {
                // 마지막 아이템이면 주문 자체를 삭제
                productData.splice(productIndex, 1);
            }
            
            // 세션 스토리지 업데이트 및 화면 다시 렌더링
            updateSessionStorage();
            updateTotalAmount();
            renderProductList();
        });
    });
    
    // 수정 버튼
    // document.querySelectorAll('.edit-btn').forEach(btn => {
    //     btn.addEventListener('click', function() {
    //         const item = this.closest('.item');
    //         const productIndex = parseInt(item.dataset.productIndex);
    //         const itemIndex = parseInt(item.dataset.itemIndex);
            
    //         // 수정할 아이템 정보를 세션 스토리지에 저장
    //         sessionStorage.setItem('editItem', JSON.stringify({
    //             productIndex: productIndex,
    //             itemIndex: itemIndex
    //         }));
            
    //         // 수정 페이지로 이동 또는 모달 창 표시
    //         // 예시: window.location.href = 'edit-flavor.html';
    //         alert('수정 페이지로 이동합니다.');
    //     });
    // });

    // const card = document.querySelector('.card-option')
    // card?.addEventListener('click', () => {
    //     location.href = '../BR.5_point_hm/point.html';
    // })
}

// 총 금액 계산 및 업데이트
function updateTotalAmount() {
    let totalAmount = 0;
    
    // 모든 상품의 totalPrice 합산
    productData.forEach(product => {
        totalAmount += product.totalPrice;
    });
    
    // priceData 업데이트
    priceData.totalAmount = totalAmount;
    priceData.paymentPrice = totalAmount - priceData.discountAmount;
    
    // 세션 스토리지 업데이트
    sessionStorage.setItem('priceData', JSON.stringify(priceData));
    
    // 화면에 표시
    updateTotalPriceDisplay();
}

// 세션 스토리지 업데이트 함수
function updateSessionStorage() {
    sessionStorage.setItem('productData', JSON.stringify(productData));
}

// 총 금액 표시 함수
function updateTotalPriceDisplay() {
    const totalPrice = document.querySelector(".total-price");
    
    if (priceData && totalPrice) {
        totalPrice.textContent = `₩${parseInt(priceData.paymentPrice).toLocaleString()}`;
    }
}

// 초기 렌더링
renderProductList();
updateTotalPriceDisplay();