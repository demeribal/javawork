document.addEventListener('DOMContentLoaded', function () {
    const discountAmountElement = document.querySelector(".discount-amount");
    const totalAmountElement = document.querySelector(".total-amount");
    const orderAmountElement = document.querySelector('.order-amount');

    const priceData = JSON.parse(sessionStorage.getItem('priceData'));
    if (!priceData) {
        alert("가격 정보가 없습니다. 다시 시도해주세요.");
        return;
    }

    // 가격 반영
    orderAmountElement.textContent = `₩${priceData.totalAmount.toLocaleString()}`;
    discountAmountElement.textContent = `₩${priceData.discountAmount.toLocaleString()}`;
    totalAmountElement.textContent = `₩${priceData.paymentPrice.toLocaleString()}`;

    // 옵션 버튼 선택 이벤트
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => selectOption(btn));
    });

    // 다음단계(결제하기) 버튼 이벤트
    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            window.location.href = "../BR.6_coupon_hm/coupon.html";
        });
    }

    // 종료 버튼 이벤트
    const exitBtn = document.getElementById("exit-button");
    if (exitBtn) {
        exitBtn.addEventListener("click", e => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = "/index.html";
        });
    }
});

// 옵션 선택
function selectOption(button) {
    const group = button.dataset.group;

    // 동일 그룹 내 기존 선택 해제
    const sameGroupButtons = document.querySelectorAll(`.option-btn[data-group="${group}"]`);
    sameGroupButtons.forEach(btn => btn.classList.remove("selected"));

    const isSelected = button.classList.contains("selected");

    if (isSelected) {
        button.classList.remove("selected");
        updateDiscount(0);
    } else {
        button.classList.add("selected");

        const label = button.innerText;
        if (label.includes("KT 할인")) {
            updateDiscount(500);
        } else if (label.includes("임직원 할인")) {
            updateDiscount(300);
        } else {
            updateDiscount(0);
        }
    }
}

// 할인 적용 및 sessionStorage 갱신
function updateDiscount(discountAmount) {
    const priceData = JSON.parse(sessionStorage.getItem('priceData')) || {};
    priceData.discountAmount = discountAmount;
    priceData.paymentPrice = priceData.totalAmount - discountAmount;

    sessionStorage.setItem('priceData', JSON.stringify(priceData));

    document.querySelector(".discount-amount").textContent = `₩${discountAmount.toLocaleString()}`;
    document.querySelector(".total-amount").textContent = `₩${priceData.paymentPrice.toLocaleString()}`;
}
