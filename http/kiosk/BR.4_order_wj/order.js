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

// 맛 배열을 정규화하여 비교 가능한 문자열로 변환
function normalizeFlavors(flavors) {
    if (!flavors) return '';
    if (Array.isArray(flavors)) {
        return flavors.slice().sort().join(',');
    }
    return flavors.toString();
}

// 상품 목록 렌더링 함수
function renderProductList() {
    const itemlist = document.querySelector('.item-list');
    itemlist.innerHTML = ''; // 목록 초기화
    
    // 상품을 그룹화 (메뉴, 옵션, 맛이 모두 같은 경우만 같은 그룹)
    const productGroups = [];
    
    productData.forEach(product => {
        // 상품의 기본 키 (이름 + 옵션)
        const baseKey = `${product.name}-${product.option}`;
        
        // 맛 정보 정규화
        const normalizedFlavors = normalizeFlavors(product.flavors);
        
        // 동일한 그룹 찾기
        let foundGroup = null;
        for (const group of productGroups) {
            const groupBaseKey = `${group.name}-${group.option}`;
            const groupNormalizedFlavors = normalizeFlavors(group.flavors);
            
            // 같은 메뉴+옵션이고 맛도 같으면 같은 그룹
            if (baseKey === groupBaseKey && normalizedFlavors === groupNormalizedFlavors) {
                foundGroup = group;
                break;
            }
        }
        
        if (foundGroup) {
            // 같은 그룹이면 수량 증가
            foundGroup.quantity += product.quantity;
            foundGroup.totalPrice += product.totalPrice;
        } else {
            // 새로운 그룹 추가
            productGroups.push({
                ...product,
                // 원본 인덱스 추적을 위해 originalIndices 추가
                originalIndices: [productData.indexOf(product)]
            });
        }
    });
    
    // 그룹화된 상품들을 렌더링
    productGroups.forEach((group, index) => {
        const option = getOptionName(group.option);
        const imageUrl = group.imageUrl;
        const flavorText = group.flavors ? 
            (Array.isArray(group.flavors) ? group.flavors.join(', ') : group.flavors) : '';
        
        const item = document.createElement('div');
        item.className = `item ${group.option} ${group.name}`;
        item.dataset.groupKey = `${group.name}-${group.option}-${normalizeFlavors(group.flavors)}`;
        item.dataset.originalIndices = JSON.stringify(group.originalIndices);
        item.style.setProperty('--order', index);
        
        item.innerHTML = `
            <div class="item-image" style="background-image: url('${imageUrl}')"></div>
            <div class="item-details">
                <div class="item-name">${group.name}</div>
                <div class="item-option">(콘/컵) ${option}(포장불가)</div>
                ${flavorText ? `<div class="item-flavor">${flavorText}</div>` : ''}
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn decrease">-</button>
                <span class="quantity">${group.quantity}</span>
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
    });
    
    // 이벤트 리스너 추가
    addEventListeners();
}

// 이벤트 리스너 추가 함수
function addEventListeners() {
    // 수량 감소 버튼
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.item');
            const originalIndices = JSON.parse(item.dataset.originalIndices);
            
            // 마지막 상품의 수량 감소
            const lastIndex = originalIndices[originalIndices.length - 1];
            if (productData[lastIndex].quantity > 1) {
                productData[lastIndex].quantity -= 1;
                productData[lastIndex].totalPrice = productData[lastIndex].unitPrice * productData[lastIndex].quantity;
            } else {
                // 수량이 1이면 해당 상품 제거
                productData.splice(lastIndex, 1);
                originalIndices.pop();
                
                // 원본 인덱스 업데이트
                if (originalIndices.length === 0) {
                    item.remove();
                    updateSessionStorage();
                    updateTotalAmount();
                    renderProductList();
                    return;
                }
                item.dataset.originalIndices = JSON.stringify(originalIndices);
            }
            
            //updateSessionStorage();
            //updateTotalAmount();
            renderProductList();
        });
    });
    
    // 수량 증가 버튼
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.item');
            const originalIndices = JSON.parse(item.dataset.originalIndices);
            
            // 첫 번째 상품의 수량 증가
            productData[originalIndices[0]].quantity += 1;
            productData[originalIndices[0]].totalPrice = productData[originalIndices[0]].unitPrice * productData[originalIndices[0]].quantity;
            
            //updateSessionStorage();
            //updateTotalAmount();
            renderProductList();
        });
    });
    
    // 삭제 버튼
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.item');
            const originalIndices = JSON.parse(item.dataset.originalIndices);
            
            // 해당 그룹의 모든 상품 삭제 (내림차순으로 삭제해야 인덱스 문제 없음)
            originalIndices.sort((a, b) => b - a).forEach(index => {
                productData.splice(index, 1);
            });
            
            //updateSessionStorage();
            //updateTotalAmount();
            renderProductList();
        });
    });
}

// 나머지 함수들은 동일하게 유지 (updateTotalAmount, updateSessionStorage, updateTotalPriceDisplay 등)

// 초기 렌더링
renderProductList();
//updateTotalPriceDisplay();



// 총 금액 계산 및 업데이트 (주석 해제)
function updateTotalAmount() {
    let totalAmount = 0;
    
    productData.forEach(product => {
        totalAmount += product.totalPrice || (product.unitPrice * product.quantity);
    });
    
    priceData.totalAmount = totalAmount;
    priceData.paymentPrice = totalAmount - (priceData.discountAmount || 0);
    
    sessionStorage.setItem('priceData', JSON.stringify(priceData));
    updateTotalPriceDisplay();
}

// 세션 스토리지 업데이트 (주석 해제)
function updateSessionStorage() {
    sessionStorage.setItem('productData', JSON.stringify(productData));
}

// 결제 버튼 이벤트 핸들러 추가
function setupPaymentButtons() {
    const cashBtn = document.querySelector('.cash-option');
    const cardBtn = document.querySelector('.card-option');
    
    if (cashBtn) {
        cashBtn.addEventListener('click', () => {
            if (productData.length === 0) {
                alert('주문 내역이 없습니다.');
                return;
            }
            updateSessionStorage();
            updateTotalAmount();
            location.href = '../BR.5_point_hm/point.html';
        });
    }
    
    if (cardBtn) {
        cardBtn.addEventListener('click', () => {
            if (productData.length === 0) {
                alert('주문 내역이 없습니다.');
                return;
            }
            updateSessionStorage();
            updateTotalAmount();
            location.href = '../BR.5_point_hm/point.html';
        });
    }
}

// 초기화 함수 수정
function initialize() {
    renderProductList();
    updateTotalAmount();
    setupPaymentButtons(); // 결제 버튼 이벤트 등록
    
    // 주문 내역이 없을 때 처리
    if (productData.length === 0) {
        const itemList = document.querySelector('.item-list');
        itemList.innerHTML = `
            <div class="empty-cart-message">
                <div class="empty-cart-icon">🛒</div>
                <p>주문 내역이 없습니다</p>
                <button class="go-to-menu-btn">메뉴 선택하러 가기</button>
            </div>
        `;
        
        document.querySelector('.go-to-menu-btn')?.addEventListener('click', () => {
            location.href = '../BR.1_menu_hb/menu.html';
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initialize);