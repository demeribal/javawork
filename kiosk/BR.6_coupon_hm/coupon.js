// coupon.js v3.0

document.addEventListener('DOMContentLoaded', function () {
    const discountAmountElement = document.querySelector(".discount-amount");
    const totalAmountElement = document.querySelector(".total-amount");
    const orderAmountElement = document.querySelector('.order-amount');

    // 💡 금액 렌더링
    const totalAmount = parseInt(sessionStorage.getItem('totalAmount')) || 0;
    const discountAmount = parseInt(sessionStorage.getItem('discountAmount')) || 0;
    const finalAmount = totalAmount - discountAmount;

    totalAmountElement.textContent = `₩${finalAmount.toLocaleString()}`;
    orderAmountElement.textContent = `₩${totalAmount.toLocaleString()}`;
    discountAmountElement.textContent = `₩${discountAmount.toLocaleString()}`;

    // 옵션 버튼 클릭 이벤트
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => selectOption(btn));
    });

    // 결제 관련 버튼 이벤트
    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn && nextBtn.innerText.includes('결제취소')) {
        nextBtn.addEventListener('click', cancelPayment);
    }
});

// 옵션 선택 기능 (신용카드만 허용)
function selectOption(button) {
    const buttonText = button.querySelector('p')?.innerText || button.innerText;

    if (!buttonText.includes("신용카드")) {
        alert("현재는 신용카드만 사용 가능합니다 🙏");
        return;
    }

    const parent = button.closest('.payment-methods');
    if (parent) {
        parent.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("selected"));
    }

    button.classList.add("selected");

    // 신용카드 선택 시 다음 단계로 이동
    window.location.href = "../BR.7_pay/pay.html";
}

// 결제 취소 기능
function cancelPayment() {
    if (confirm("결제를 취소하시겠습니까?")) {
        sessionStorage.clear();
        window.location.href = "../BR.1_menu_hb/menu.html";
    }
}
