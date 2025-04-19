const productData = JSON.parse(sessionStorage.getItem('productData'));
console.log(productData)

productData.forEach(order => {
    const itemlist = document.querySelector('.item-list');

    let option = ""
    if (order.option == "cup") option = "컵"
    else if (order.option == "corn") option = "콘"
    else if (order.option == "waffle") option = "와플콘"

    for (let i=0; i<order.quantity; i++) {
        const item = `
            <div class="item" id="${option+i}">
                <div class="item-image" style="background-image: url('${order.imageUrl}')"></div>
                <div class="item-details">
                    <div class="item-name">${order.name}</div>
                    <div class="item-option">(콘/컵) ${option}(포장불가)</div>
                    <div class="item-flavor">${order.flavors[i]}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn">-</button>
                    <span class="quantity">1</span>
                    <button class="quantity-btn">+</button>
                </div>
                <div class="item-actions">
                    <button class="edit-btn">
                        <img src="images/edit-btn.png" alt="수정">
                    </button>
                    <button class="delete-btn">
                        <img src="images/delete-btn.png" alt="삭제">
                    </button>
                </div>
            </div>
        `
        itemlist.innerHTML += item;
    }
})  



//총 금액
function updateTotalPrice() {
    // 세션에서 priceData 객체 불러오기
    const priceData = JSON.parse(sessionStorage.getItem('priceData')); 

    const totalPrice = document.querySelector(".total-price"); // .total-price 클래스를 가진 요소 찾기

    // priceData와 totalPrice가 존재하면 totalAmount를 출력
    if (priceData && priceData.totalAmount && totalPrice) {
        totalPrice.textContent = `₩${parseInt(priceData.totalAmount).toLocaleString()}`; 
    }
}

updateTotalPrice();



// 수량 조절 기능
function quantityControl() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const quantityElement = this.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (this.textContent === '+') {
                quantity++;
            } else if (this.textContent === '-' && quantity > 1) {
                quantity--;
            }
            
            quantityElement.textContent = quantity;
        });
    });
}

quantityControl();

function paymentOptions() {
    const cash = document.querySelector('.cash-option');
    cash.addEventListener('click', function() {
        location.href='../BR.5_point_hm/point.html';
    });

    const card = document.querySelector('.card-option');
    card.addEventListener('click', function() {
        location.href='../BR.5_point_hm/point.html';
    });
}

paymentOptions();

function editProduct() {
    const editBtn = document.querySelectorAll('.edit-btn');
    editBtn.forEach(btn => {
        btn.addEventListener('click', function() {
            location.href='../BR.4_flavor_sy/flavor.html';
        });
    });
}

editProduct();


function deleteProduct() {
    const deleteBtn = document.querySelectorAll('.delete-btn');
    deleteBtn.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemActions = btn.parentElement;
            const item = itemActions.parentElement;
            item.remove();
        });
    });
}

deleteProduct();