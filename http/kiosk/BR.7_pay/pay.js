const tossPayments = TossPayments('test_ck_ma60RZblrqyJQ52ok0NErwzYWBn1'); // 자신의 클라이언트 키로 대체

let isSubmitting = false; // 중복 클릭 방지용 상태

//버튼 active
const methodButtons = document.querySelectorAll('.method');

methodButtons.forEach(button => {
  button.addEventListener('click', () => {
    methodButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

// 알림창 닫기 함수
function closeAlert() {
    const alertElement = document.getElementById('alertBox');
    if (alertElement) {
      alertElement.style.display = 'none';
    }
  }

//select-box 글자 색 조정
  const selectBox = document.getElementById('cardSelect');

  function updateSelectColor() {
    if (selectBox.value === '') {
      selectBox.style.color = '#c9c9c9'; // 기본 선택 전: 회색
    } else {
      selectBox.style.color = '#000000'; // 선택 후: 검정
    }
  }

  if (selectBox) {
    selectBox.addEventListener('change', updateSelectColor);
    window.addEventListener('DOMContentLoaded', updateSelectColor);
  }

  //필수 버튼 선택 후 결제하기 버튼 활성화
  document.getElementById('payBtn').addEventListener('click', async function (e) {
    if (isSubmitting) return;
    isSubmitting = true;  

    const isChecked = document.getElementById('terms').checked;
    if (!isChecked) {
      alert('결제를 진행하려면 약관에 동의해 주세요.');
      return;
    }
  
    // 세션 값 불러오기
    const priceData = JSON.parse(sessionStorage.getItem('priceData')) || {};
    const productData = JSON.parse(sessionStorage.getItem('productData')) || [];
    const paymentmethod = document.querySelector('.method.active')?.innerText || '카드';
    const paymenthistory = productData.map(p => p.name).join(', ');
    const amount = priceData.paymentPrice || 0;
    const paidat = new Date().toISOString();
    const officeId = 1;
    const paycode = 'PAY-' + Date.now();
    const payBtn = document.getElementById('payBtn');
    payBtn.disabled = true;
    payBtn.textContent = '처리 중...'; // 사용자가 중복 클릭하지 않도록 시각적 피드백
  
    const payload = {
      paymentmethod,
      paymenthistory,
      amount,
      paidat,
      officeId,
      paycode,
      menuId: null
    };

    // 🟦 Toss 결제 흐름 분기
    if (paymentmethod === '카드') {
      try {
        await tossPayments.requestPayment('카드', {
          amount,
          orderId: paycode,
          orderName: paymenthistory,
          customerName: "고객명", // 원하는 사용자 이름
          successUrl: `http://localhost:8080/pay-success.html` +
          `?paycode=${paycode}` +
          `&amount=${amount}` +
          `&method=${paymentmethod}` +
          `&history=${encodeURIComponent(paymenthistory)}` +
          `&officeId=${officeId}` +
          `&productData=${encodeURIComponent(JSON.stringify(productData))}`,

          failUrl: `http://localhost:8080/pay-fail.html`          
        });
      } catch (error) {
        console.error('❌ Toss 결제 요청 실패:', error);
        alert('결제 요청에 실패했습니다.');
        isSubmitting = false;
        payBtn.disabled = false;
        payBtn.textContent = '결제하기';
      }
      return;
    }
   
});