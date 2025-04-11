<<<<<<< HEAD:kiosk/BR.1_menu_hb/menu.js
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.select-icecream').style.display = 'none';
    document.querySelector('.select-coffee').style.display = 'none';
    document.querySelector('.select-drink').style.display = 'none';

    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        if (item.dataset.type === 'coffee') {
            item.style.display = 'none'; // 커피 항목 숨기기
        }
    });
});
=======
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.select-icecream').style.display = 'none';
    document.querySelector('.select-coffee').style.display = 'none';
    document.querySelector('.select-drink').style.display = 'none';

    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        if (item.dataset.type === 'coffee') {
            item.style.display = 'none'; // 커피 항목 숨기기
        }
    });

    // li 요소에 클릭 이벤트 추가
    document.querySelectorAll('#item-list li').forEach(item => {
        item.addEventListener('click', function() {
            // 모든 선택된 제품 목록 숨기기
            document.querySelector('.select-icecream').style.display = 'none';
            document.querySelector('.select-coffee').style.display = 'none';
            document.querySelector('.select-drink').style.display = 'none';

            // 모든 li에서 active 클래스 제거
            document.querySelectorAll('#item-list li').forEach(li => {
                li.classList.remove('active');
            });

            // 클릭된 항목에 따라 해당 제품 목록 보이기
            const selectedItem = this.textContent; // 클릭된 항목의 텍스트
            if (selectedItem === '아이스크림') {
                document.querySelector('.select-icecream').style.display = 'flex';
            } else if (selectedItem === '커피') {
                document.querySelector('.select-coffee').style.display = 'flex';
            } else if (selectedItem === '음료') {
                document.querySelector('.select-drink').style.display = 'flex';
            }
        });
    });

    const products = document.querySelectorAll('.product');
    const cartButton = document.querySelector('.cart-button');
    const payButton = document.querySelector('.pay-button');
    const cartCountElement = document.querySelector('.cart-count');

    let cartCount = 0; // 장바구니에 담긴 제품 수
    let totalPrice = 0; // 총 가격

    
    products.forEach(product => {
        product.addEventListener('click', function() {
            cartCountElement.style.display = 'flex'; // 상품 클릭 시 장바구니 수량 보이도록 설정
        });
    });

    products.forEach(product => {
        product.addEventListener('click', function() {
            // 제품 이름과 가격 가져오기
            const productName = this.querySelector('.product-name').textContent;
            const productPrice = parseFloat(this.querySelector('.product-price').textContent.replace(/₩/g, '').replace(/,/g, '').trim());

            // 장바구니에 제품 추가
            cartCount++;
            totalPrice += productPrice;
            console.log(totalPrice);

            // 장바구니 버튼에 수량 표시
            cartButton.dataset.count = cartCount;
            cartCountElement.textContent = cartCount;


            payButton.id = 'paybutton'; // 아이디 추가
            // 결제하기 버튼에 총 가격 표시
            payButton.textContent = `₩${totalPrice.toLocaleString()}   결제하기 `;
        });
    });

    // 초기 상태로 아이스크림 목록 보이기
    document.querySelector('.select-icecream').style.display = 'flex';
});
>>>>>>> 9c6b04bce6c68ad2d2f1e2efc205ae3638047b81:BR_kiosk/menu.js
