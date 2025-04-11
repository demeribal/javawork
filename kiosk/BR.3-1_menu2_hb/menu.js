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


// menu.js
document.addEventListener('DOMContentLoaded', function () {
    // URL 파라미터 파싱
    const params = new URLSearchParams(window.location.search);
    
    // 컵/콘/와플 수량
    const cupQty = parseInt(params.get('cup_quantity')) || 0;
    const cornQty = parseInt(params.get('corn_quantity')) || 0;
    const waffleQty = parseInt(params.get('waffle_quantity')) || 0;
  
    // 선택한 맛 정보
    const flavorData = JSON.parse(decodeURIComponent(params.get('selectedFlavors') || '[]'));
  
    // UI 초기 설정
    document.querySelector('.select-icecream').style.display = 'flex';
    document.querySelector('.select-coffee').style.display = 'none';
    document.querySelector('.select-drink').style.display = 'none';
  
    // 커피 항목 숨기기 (기존 코드 유지)
    document.querySelectorAll('.item[data-type="coffee"]').forEach(item => {
      item.style.display = 'none';
    });
  
    // 장바구니 초기화
    const cartCountElement = document.querySelector('.cart-count');
    let cartCount = cupQty + cornQty + waffleQty;
    cartCountElement.textContent = cartCount;
    cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
  
    // 결제 버튼 초기화
    const payButton = document.querySelector('.pay-button');
    payButton.id = 'paybutton';
    let totalPrice = 0; // 추가 상품 가격용
  
    // 메뉴 탭 전환 로직
    document.querySelectorAll('#item-list li').forEach(item => {
      item.addEventListener('click', function () {
        document.querySelectorAll('.select-icecream, .select-coffee, .select-drink')
          .forEach(el => el.style.display = 'none');
        
        document.querySelectorAll('#item-list li').forEach(li => {
          li.classList.remove('active');
        });
  
        switch (this.textContent) {
          case '아이스크림':
            document.querySelector('.select-icecream').style.display = 'flex';
            break;
          case '커피':
            document.querySelector('.select-coffee').style.display = 'flex';
            break;
          case '음료':
            document.querySelector('.select-drink').style.display = 'flex';
            break;
        }
      });
    });
  
    // 상품 클릭 이벤트 핸들러
    document.querySelectorAll('.product').forEach(product => {
      product.addEventListener('click', function () {
        const price = parseFloat(
          this.querySelector('.product-price')
            .textContent.replace(/[^0-9]/g, '')
        );
  
        // 장바구니 업데이트
        cartCount++;
        totalPrice += price;
        
        // UI 반영
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = 'flex';
        payButton.textContent = `₩${totalPrice.toLocaleString()}   결제하기`;
      });
    });
  
    // 결제 버튼 클릭 이벤트
    document.querySelector('.pay-link').addEventListener('click', function(e) {
      e.preventDefault();
      const nextUrl = `../BR.4_order_wj/order.html?cup=${cupQty}&corn=${cornQty}&waffle=${waffleQty}&flavors=${encodeURIComponent(JSON.stringify(flavorData))}`;
      window.location.href = nextUrl;
    });
  });


  // 1. URL 파라미터 키 이름 일치 여부
console.log('cup_quantity:', params.get('cup_quantity'));

// 2. JSON 파싱 안전장치
JSON.parse(decodeURIComponent(params.get('selectedFlavors') || '[]'));

// 3. 숫자 변환 안전장치
parseInt(value) || 0


document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('click', function() {
      // 기존 URL 파라미터 유지
      const currentParams = new URLSearchParams(window.location.search);
      
      // 새 URL 생성
      const nextUrl = `../BR.2_count_sm/count.html?${currentParams.toString()}`;
      window.location.href = nextUrl;
    });
  });


  document.querySelector('.pay-link').addEventListener('click', function(e) {
    e.preventDefault();
    
    // 현재 URL 파라미터 가져오기
    const params = new URLSearchParams(window.location.search);
    
    // 추가 상품 정보 수집
    const selectedProducts = [];
    document.querySelectorAll('.product.selected').forEach(product => {
      selectedProducts.push({
        name: product.querySelector('.product-name').textContent,
        price: product.querySelector('.product-price').textContent
      });
    });
  
    // 최종 URL 생성
    const nextUrl = `../BR.4_order_wj/order.html?${params.toString()}&products=${encodeURIComponent(JSON.stringify(selectedProducts))}`;
    window.location.href = nextUrl;
  });