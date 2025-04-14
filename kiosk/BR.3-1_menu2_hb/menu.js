document.addEventListener("DOMContentLoaded", function () {
  // ✅ UI 초기 설정
  document.querySelector(".select-icecream").style.display = "flex";
  document.querySelector(".select-coffee").style.display = "none";
  document.querySelector(".select-drink").style.display = "none";

  // ✅ DOM 요소 참조
  const cartCountElement = document.querySelector(".cart-count");
  const payButton = document.querySelector(".pay-button");
  const cartButton = document.querySelector(".cart-button");
  const products = document.querySelectorAll(".product");

  // ✅ 세션에서 productData 가져오기 + 잘못된 데이터 제거
  let savedData = JSON.parse(sessionStorage.getItem("productData")) || [];
  savedData = savedData.filter(item =>
    typeof item.unitPrice === "number" &&
    typeof item.quantity === "number" &&
    typeof item.totalPrice === "number"
  );
  sessionStorage.setItem("productData", JSON.stringify(savedData));

  // ✅ 총 수량 및 총 가격 계산
  let cartCount = 0;
  let totalPrice = 0;
  savedData.forEach(item => {
    cartCount += item.quantity;
    totalPrice += item.totalPrice;
  });

  // ✅ UI 반영
  cartCountElement.textContent = cartCount;
  cartCountElement.style.display = cartCount > 0 ? "flex" : "none";
  payButton.id = "paybutton";
  payButton.textContent = `₩${totalPrice.toLocaleString()}   결제하기`;

  // ✅ 메뉴 탭 클릭 시 제품 영역 전환
  document.querySelectorAll("#item-list li").forEach((item) => {
    item.addEventListener("click", function () {
      document.querySelectorAll(".select-icecream, .select-coffee, .select-drink")
        .forEach(el => el.style.display = "none");

      document.querySelectorAll("#item-list li").forEach(li => {
        li.classList.remove("active");
      });
      this.classList.add("active");

      const selected = this.textContent;
      if (selected === "아이스크림") {
        document.querySelector(".select-icecream").style.display = "flex";
      } else if (selected === "커피") {
        document.querySelector(".select-coffee").style.display = "flex";
      } else if (selected === "음료") {
        document.querySelector(".select-drink").style.display = "flex";
      }
    });
  });

  // ✅ 상품 클릭 시 장바구니 반영
  products.forEach(product => {
    product.addEventListener("click", function () {
      const productName = this.querySelector(".product-name").textContent;
      const productPrice = parseFloat(
        this.querySelector(".product-price")
          .textContent.replace(/₩/g, "").replace(/,/g, "").trim()
      );

      const newItem = {
        name: productName,
        unitPrice: productPrice,
        quantity: 1,
        totalPrice: productPrice
      };

      savedData.push(newItem);
      sessionStorage.setItem("productData", JSON.stringify(savedData));

      // 수량/가격 갱신
      cartCount += 1;
      totalPrice += productPrice;

      cartCountElement.textContent = cartCount;
      cartCountElement.style.display = "flex";
      payButton.textContent = `₩${totalPrice.toLocaleString()}   결제하기`;
    });
  });
});
