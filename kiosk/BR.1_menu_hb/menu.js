document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.select-icecream').style.display = 'none';
    document.querySelector('.select-coffee').style.display = 'none';
    document.querySelector('.select-drink').style.display = 'none';

    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        if (item.dataset.type === 'coffee') {
            item.style.display = 'none'; // 커피 항목 숨기기
        }
    });
});

