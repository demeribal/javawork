// menu.js
window.addEventListener('pageshow', function(event) {
  if (event.persisted || performance.getEntriesByType('navigation')[0].type === 'back_forward') {
    sessionStorage.removeItem('productData');
    document.querySelector('.cart-count').textContent = '0';
    document.querySelector('.pay-button').textContent = '결제하기';
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // ✅ 초기화
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
/*
  // ✅ 세션 초기화 (Menu1 진입 시)
  if (!window.location.pathname.includes('count.html')) {
    sessionStorage.removeItem('productData');
  }
*/
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

  // 임시 세션
  let tempProductData = [];

  // ✅ 상품 선택 핸들러
  products.forEach(product => {
    product.addEventListener('click', function() {
      const productName = this.querySelector('.product-name').textContent;
      const productPrice = parseFloat(
        this.querySelector('.product-price').textContent
          .replace(/[^0-9]/g, '')
      );

      // 세션 업데이트
      const productData = JSON.parse(sessionStorage.getItem('productData')) || [];
      const existingProduct = productData.find(item => item.name === productName);

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.totalPrice += productPrice;
      } else {
        tempProductData.push({
          name: productName,
          unitPrice: productPrice,
          quantity: 1,
          totalPrice: productPrice
        });
      }

      sessionStorage.setItem('tempProductData', JSON.stringify(tempProductData));
      updateCartUI(tempProductData);
    });
  });



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

  // ✅ UI 업데이트 함수
  function updateCartUI(productData) {
    const totalCount = productData.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = productData.reduce((sum, item) => sum + item.totalPrice, 0);
  
    cartCountElement.textContent = totalCount;
    cartCountElement.style.display = totalCount > 0 ? 'flex' : 'none';
  
    if (totalCount > 0) {
      payButton.textContent = `₩${totalPrice.toLocaleString()} 결제하기`;
    } else {
      payButton.textContent = `결제하기`;
    }
  }

  // ✅ 초기 UI 업데이트
  const initialData = JSON.parse(sessionStorage.getItem('productData')) || [];
  updateCartUI(initialData);
});
