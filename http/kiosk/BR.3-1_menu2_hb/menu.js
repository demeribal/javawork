


document.addEventListener("DOMContentLoaded", function () {
  // ✅ 초기화
  const cartCountElement = document.querySelector(".cart-count");
  const payButton = document.querySelector(".pay-button");
  const products = document.querySelectorAll(".product");

  // 세션에서 tempProductData 가져오기
  let tempProductData = JSON.parse(sessionStorage.getItem('tempProductData'))



  // ✅ 장바구니 UI 업데이트 함수
  function updateCartUI(products) {
    const totalCount = products.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount  = products.reduce((sum, item) => sum + item.totalPrice, 0);

    cartCountElement.textContent = totalCount;
    cartCountElement.style.display = totalCount > 0 ? 'flex' : 'none';
    let discountAmount = 0;
    const priceData = {
      totalAmount: totalAmount,  // 상품의 총합 금액
      discountAmount: discountAmount,         // 기본 할인액 0으로 설정
      paymentPrice: totalAmount - discountAmount // 최종 가격 (초기에는 상품 총액)
    };

    sessionStorage.setItem('priceData', JSON.stringify(priceData));
    
    if (totalCount > 0) {
      payButton.textContent = `₩${totalAmount .toLocaleString()} 결제하기`;
    } else {
      payButton.textContent = `결제하기`;
    }
  }
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
          flavors: product.flavors
        });
      }
    });

    // 변경된 productData를 세션에 저장
    sessionStorage.setItem('productData', JSON.stringify(productData));

    // tempProductData 키 삭제 -> tempProductData 삭제
    sessionStorage.removeItem('tempProductData');
    // 장바구니 UI 업데이트 (새로운 productData 사용)
    updateCartUI(productData);
  } else {
    // tempProductData가 비어있으면 확인용 로그 추가
    console.log('tempProductData is empty or not present.');
  }
    // 상품 클릭 이벤트 핸들러
    products.forEach(product => {
      product.addEventListener('click', function() {
        const productName = this.querySelector('.product-name').textContent;
        const productPrice = parseFloat(
          this.querySelector('.product-price').textContent.replace(/[^0-9]/g, '')
        );
    
        const selectedProduct = {
          name: productName,
          unitPrice: productPrice,
          quantity: 1,
          totalPrice: productPrice
        };
    
        // 무조건 하나만 저장
        tempProductData.products = [selectedProduct];
    
        // 세션에 저장
        sessionStorage.setItem('tempProductData', JSON.stringify([selectedProduct]));
    
        // 장바구니 UI 업데이트
        updateCartUI([selectedProduct]);
    
        // 다음 페이지 이동
        window.location.href = 'count.html';
      });
    });
    

});


