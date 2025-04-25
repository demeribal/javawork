const tossPayments = TossPayments('test_ck_ma60RZblrqyJQ52ok0NErwzYWBn1'); // 자신의 클라이언트 키로 대체

let isSubmitting = false; // 중복 클릭 방지용 상태

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
    const paycode = 'PAY-' + Date.now();
/*
    const stockId = await fetch(`http://localhost:8080/api/stock/branch/menu/${menuId}`)
    .then(res => res.json())
    .then(data => data.id);
*/

    // pay.js 안에 menuId 대신 stockId를 구하는 로직 수정
    const targetMenuName = productData[0]?.flavor[0][0];
    let stockId = null;

    if (targetMenuName) {
      stockId = await fetch(`http://localhost:8080/api/menus/${targetMenuName}`)
        .then(res => res.json())
        .then(data => {
          return data?.id || null;
        });
    }

    const payload = {
      paymentmethod,
      paymenthistory,
      amount,
      paidat,
      paycode,
      stockId: stockId,
    };
    console.log("🛰 DB로 전송할 payload:", payload);

    // 🟦 Toss 결제 흐름 분기
    if (paymentmethod === '카드') {
      try {
        await tossPayments.requestPayment('카드', {
          orderId: paycode,
          orderName: paymenthistory,
          customerName: "고객명", // 원하는 사용자 이름
          successUrl: `http://localhost:8080/pay-success.html` +
          `?paycode=${paycode}` +
          `&amount=${amount}` +
          `&method=${paymentmethod}` +
          `&history=${paymenthistory}` +
          `&productData=${JSON.stringify(productData)}`,
          failUrl: `http://localhost:8080/pay-fail.html`          
        });
      console.log("🔗 successUrl:", successUrl);

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