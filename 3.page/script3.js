// script.js

let totalPages = 2; // 전체 페이지 수
let currentPage = 0; // 초기 페이지 (0부터 시작)

function updateArrowsAndDots() {
  const leftArrow = document.querySelector('.arrow.left');
  const rightArrow = document.querySelector('.arrow.right');
  
  // 화살표 업데이트
  if (currentPage === 0) {
    leftArrow.style.display = 'none';
    rightArrow.style.display = 'flex';
  } else if (currentPage === totalPages - 1) {
    leftArrow.style.display = 'flex';
    rightArrow.style.display = 'none';
  } else {
    leftArrow.style.display = 'flex';
    rightArrow.style.display = 'flex';
  }
  
  // dot 업데이트
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    if (idx === currentPage) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

document.querySelector('.arrow.right').addEventListener('click', function() {
  if (currentPage < totalPages - 1) {
    currentPage++;
    updateArrowsAndDots();
    // 페이지 이동 로직 추가...
  }
});

document.querySelector('.arrow.left').addEventListener('click', function() {
  if (currentPage > 0) {
    currentPage--;
    updateArrowsAndDots();
    // 페이지 이동 로직 추가...
  }
});

// 초기 설정
updateArrowsAndDots();
