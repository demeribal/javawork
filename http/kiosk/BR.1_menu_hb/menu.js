const params = new URLSearchParams(window.location.search);
const cartCountElement = document.querySelector('.cart-count');
const payButton = document.querySelector('.pay-button');
const products = document.querySelectorAll('.product');
const tabs = document.querySelectorAll('#item-list li');
const sections = {
  icecream: document.querySelector('.select-icecream'),
  coffee: document.querySelector('.select-coffee'),
  drink: document.querySelector('.select-drink')
};

const tempProductData = JSON.parse(sessionStorage.getItem('tempProductData')) || [];
document.addEventListener('DOMContentLoaded', function(event) {
  selectMenu();
  sessionManagement();
  pageUI(event);
  const productData = JSON.parse(sessionStorage.getItem('productData')) || [];
  updateCartUI(productData);
});

function selectMenu() {
  products.forEach(product => {
    product.addEventListener('click', function() {
      const productName = this.querySelector('.product-name').textContent;
      const productPrice = parseFloat(
        this.querySelector('.product-price').textContent.replace(/[^0-9]/g, '')
      );
      const productImageUrl = this.querySelector('.product-image').src;
      // 상품 데이터 처리
      sessionUpdate(productName, productPrice, productImageUrl);
    });
  });
}

function sessionUpdate(productName, productPrice,productImageUrl) {
  const productData = JSON.parse(sessionStorage.getItem('productData')) || [];
  const tempProductData = JSON.parse(sessionStorage.getItem('tempProductData')) || [];

  //메뉴를 눌렀을 때 temp생성
  tempProductData.push({
    name: productName,
    unitPrice: productPrice,
    quantity: 1, 
    totalPrice: productPrice,
    imageUrl: productImageUrl
  });

  const existingProduct = productData.find(item => item.name === productName);
  // 기존 상품이 있다면 수량과 가격을 갱신
  if (existingProduct) {
    existingProduct.quantity += 1;
    existingProduct.totalPrice += productPrice;
  }
  // 업데이트된 tempProductData를 세션에 저장
  sessionStorage.setItem('tempProductData', JSON.stringify(tempProductData));
  sessionStorage.setItem('productData', JSON.stringify(productData));

}

function updateCartUI(productData) {
  // 수량 합산
  const totalCount = productData.reduce((sum, item) => sum + item.quantity, 0);

  // 총 금액 합산
  const totalAmount = productData.reduce((sum, item) => sum + item.totalPrice, 0);

  cartCountElement.textContent = totalCount;
  cartCountElement.style.display = totalCount > 0 ? 'flex' : 'none';

  let discountAmount = 0;
  const priceData = {
    totalAmount: totalAmount,
    discountAmount: discountAmount,
    paymentPrice: totalAmount - discountAmount
  };
  sessionStorage.setItem('priceData', JSON.stringify(priceData));

  // 최종 결제 금액을 텍스트에 반영
  if (totalCount > 0) {
    payButton.textContent = `₩${priceData.paymentPrice.toLocaleString()} 결제하기`;
  } else {
    payButton.textContent = `결제하기`;
  }
}
  
  

function pageUI(event){
  if (event.persisted || performance.getEntriesByType('navigation')[0].type === 'back_forward') {
    sessionStorage.removeItem('productData');
    document.querySelector('.cart-count').textContent = '0';
    document.querySelector('.pay-button').textContent = '결제하기';
  }
  
  // ✅ UI 초기 설정
  sections.icecream.style.display = 'flex';
  sections.coffee.style.display = 'none';
  sections.drink.style.display = 'none';
  document.querySelectorAll('.item[data-type="coffee"]').forEach(item => item.style.display = 'none');

  // ✅ 메뉴 탭 전환
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      Object.values(sections).forEach(section => section.style.display = 'none');
      switch(this.textContent) {
        case '아이스크림': sections.icecream.style.display = 'flex'; break;
        case '커피': sections.coffee.style.display = 'flex'; break;
        case '음료': sections.drink.style.display = 'flex'; break;
      }
    });
  });

}

  // ✅ 결제 버튼 핸들러
  document.querySelector('.pay-link').addEventListener('click', function(e) {
    e.preventDefault();

    const productData = JSON.parse(sessionStorage.getItem('productData')) || [];
    if (productData.length === 0) {
      alert("상품을 선택해주세요.");
      return;
    }

    const nextUrl = `../BR.4_order_wj/order.html?${params.toString()}&products=${encodeURIComponent(JSON.stringify(productData))}`;
    window.location.href = nextUrl;
  });


function sessionManagement(){
  if (sessionStorage.getItem("tempProductData")) {
    // ✅ 페이지가 로드되면 tempProductData를 productData로 넘기고 초기화
      if (tempProductData.products.length > 0) {
        // 세션에서 기존 productData를 가져오기 (없으면 빈 배열로 초기화)
        let productData = JSON.parse(sessionStorage.getItem('productData')) || [];
    
        // tempProductData의 products 배열을 productData에 추가
        tempProductData.products.forEach(product => {
          const existingProduct = productData.find(item => item.name === product.name && item.option === product.option);
    
          if (existingProduct) {
            existingProduct.quantity += product.quantity;
            existingProduct.totalPrice += product.totalPrice;
          } else {
            productData.push({
              name: product.name,
              unitPrice: product.unitPrice,
              quantity: product.quantity,
              totalPrice: product.totalPrice,
              option: product.option,
              flavors: product.flavors,
              imageUrl: product.ImageUrl
            });
          }
        });
        // 변경된 productData를 세션에 저장
        sessionStorage.setItem('productData', JSON.stringify(productData));
        // tempProductData 키 삭제 -> tempProductData 삭제
        sessionStorage.removeItem('tempProductData');

        
      }
    }
    
}

