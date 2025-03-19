// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 현재 페이지 확인 및 탭 활성화
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage.includes('point.html')) {
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
        document.querySelector('[onclick="showTab(\'point\')"]').classList.add('active');
    } else if (currentPage.includes('coupon.html')) {
        document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
        document.querySelector('[onclick="showTab(\'coupon\')"]').classList.add('active');
    }
    
    // 옵션 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectOption(this);
        });
    });
    
    // 이전 버튼에 이벤트 리스너 추가
    const prevBtn = document.querySelector('.prev-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goBack();
        });
    }
    
    // 결제 관련 버튼에 이벤트 리스너 추가
    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn) {
        if (nextBtn.innerText.includes('결제취소')) {
            nextBtn.addEventListener('click', function() {
                cancelPayment();
            });
        } else if (nextBtn.innerText.includes('다음단계')) {
            nextBtn.addEventListener('click', function() {
                confirmPayment();
            });
        }
    }
});

// 탭 전환 기능
function showTab(tabName) {
    // 현재 페이지 경로 확인
    const currentPage = window.location.pathname.split('/').pop();
    
    // 불필요한 페이지 리로드 방지
    if (tabName === 'point' && currentPage === 'point.html') {
        return;
    } else if (tabName === 'coupon' && currentPage === 'coupon.html') {
        return;
    }
    
    // 페이지 이동
    if (tabName === 'point') {
        window.location.href = 'point.html';
    } else if (tabName === 'coupon') {
        window.location.href = 'coupon.html';
    }
}

// 옵션 선택 기능
function selectOption(button) {
    // 같은 그룹의 버튼 초기화
    const parent = button.closest('.button-container') || 
                  button.closest('.point-options') || 
                  button.closest('.discount-options') || 
                  button.closest('.payment-methods');
    
    if (parent) {
        parent.querySelectorAll(".option-btn").forEach(btn => btn.classList.remove("selected"));
    }
    button.classList.add("selected");

    // 할인 적용
    const buttonText = button.querySelector('p') ? 
                       button.querySelector('p').innerText : 
                       button.innerText;
    
    if (buttonText.includes("KT 할인")) {
        document.querySelector(".discount-amount").innerText = "₩500";
        document.querySelector(".total-amount").innerText = "₩12,300";
    } else if (buttonText.includes("임직원 할인")) {
        document.querySelector(".discount-amount").innerText = "₩300";
        document.querySelector(".total-amount").innerText = "₩12,500";
    } else {
        document.querySelector(".discount-amount").innerText = "₩0";
        document.querySelector(".total-amount").innerText = "₩12,800";
    }
}

// 뒤로 가기
function goBack() {
    window.history.back();
}

// 결제 취소
function cancelPayment() {
    if (confirm("결제를 취소하시겠습니까?")) {
        window.location.href = "index.html"; // 홈으로 이동
    }
}

// 결제 확인
function confirmPayment() {
    const selectedOption = document.querySelector(".option-btn.selected");
    
    if (!selectedOption) {
        alert("결제 방식을 선택해주세요!");
        return;
    }

    const selectedText = selectedOption.querySelector('p') ? 
                        selectedOption.querySelector('p').innerText : 
                        selectedOption.innerText;
    
    if (confirm(`"${selectedText}" 결제를 진행하시겠습니까?`)) {
        window.location.href = "coupon.html"; // 결제 완료 페이지로 이동
    }
}
