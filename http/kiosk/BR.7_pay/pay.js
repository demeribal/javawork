// 모든 코드를 DOMContentLoaded 이벤트 내부로 이동
document.addEventListener('DOMContentLoaded', function() {
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

  document.addEventListener('DOMContentLoaded', function() {
    const payBtn = document.getElementById('payBtn');
    
    if (payBtn) { // 요소 존재 확인 추가
      payBtn.addEventListener('click', async function(e) {
        // 결제 로직
      });
    } else {
      console.error('결제 버튼 요소를 찾을 수 없습니다.');
    }
  });

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
    payBtn.disabled = true;
    payBtn.textContent = '처리 중...'; // 사용자가 중복 클릭하지 않도록 시각적 피드백
  
    const payload = {
      paymentmethod,
      paymenthistory,
      amount,
      paidat,
      officeId,
      paycode,
      flavors: productData
    .map(p => p.flavors) // 각 제품의 flavors 배열 가져오기
    .flat() // 2차원 배열을 1차원으로 평탄화
    .join(',') // 쉼표로 구분된 문자열로 변환
};
    
  try{
  // 🔽 API 요청 (POST)
  const response = await fetch('http://localhost:8080/api/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text(); // 서버에서 반환한 상세 오류 확인
    throw new Error(`서버 오류 (${response.status}): ${errorText}`);
  }

  try{
  // 2. 영수증 프린트 요청
  await fetch('http://192.168.0.10:4242/print', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      store: "강서지점",
      details: productData.map(p => p.name),
      amount: amount,
      date: new Date().toLocaleString("ko-KR"),
      method: paymentmethod,
      paycode: paycode
    })
  });
} catch (printErr) {
  console.warn('❗ 영수증 출력 실패:', printErr);
  alert('✅ 결제 완료, 영수증 출력에 실패했습니다.');
  window.location.href = '../BR.8_success_wj/success.html';
  return;
}

  // 3. 완료 알림 및 리디렉션
  alert('✅ 결제 완료, 영수증이 출력되었습니다.');
  window.location.href = '../BR.8_success_wj/success.html';

} catch (err) {
  console.error('❌ 오류 발생:', err);
  alert('결제 저장에 실패했습니다.');

  isSubmitting = false;
  payBtn.disabled = false;
  payBtn.textContent = '결제하기';
  
  return;
}
});
});