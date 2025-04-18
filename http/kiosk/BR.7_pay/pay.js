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

  selectBox.addEventListener('change', updateSelectColor);

  window.addEventListener('DOMContentLoaded', updateSelectColor);

  //필수 버튼 선택 후 결제하기 버튼 활성화
  document.getElementById('payBtn').addEventListener('click', async function (e) {
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
    const storelocation = '강서지점';
    const paycode = 'PAY-' + Date.now();
  
    const payload = {
      paymentmethod,
      paymenthistory,
      amount,
      paidat,
      storelocation,
      paycode,
      menuId: null
    };
    
  // 🔽 API 요청 (POST)
  fetch('http://localhost:8080/api/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error('서버 응답 오류');
      return res.text(); // 또는 res.json()
    })
    .then(() => {
      // 성공 시 페이지 이동
      window.location.href = '../BR.8_success_wj/success.html';
    })
    .catch(err => {
      console.error('❌ 결제 저장 실패:', err);
      alert('결제 저장에 실패했습니다.');
    });
});