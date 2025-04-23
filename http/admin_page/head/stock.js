document.addEventListener('DOMContentLoaded', () => {

  window.fetchOrderList = fetchOrderList;

});

function getBranchName(branchName) {
  const branches = {
      "강서지점": "gangseo",
      "상봉지점": "sangbong",
      "하남지점": "hanam"
  };
  return branches[branchName] || branchName;
}

function getIsUse(isUse) {
  isUse = Boolean(isUse);
  const useImg = {
    true : "sale.svg",
    false : "stopsale.svg"
  };
  return useImg[isUse] || isUse;
}

function getStatus(status) {
  const statusImg = {
      "확인중": "checking.svg",
      "배송중": "indelivery.svg",
      "배송완료": "deliverycomplete.svg"
  };
  return statusImg[status] || status;
}

function setStatus(statusImg) {
  const status = {
      "checking.svg": "확인중",
      "indelivery.svg": "배송중",
      "deliverycomplete.svg": "배송완료"
  };
  return status[statusImg] || statusImg;
}

function fetchOrderList() {
  fetch("http://tomhoon.duckdns.org:8882/api/stock/header")
  .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("stock-table-body");
    
      if (!tbody) {
        console.warn("⚠️ stock-table-body 요소 없음!");
        return;
      }
      tbody.innerHTML = ""; // 기존 내용 비우기

      data.forEach((order) => {
        const branch = getBranchName(order.officeName);
        const useImage = getIsUse(order.use);
        const statusImage = getStatus(order.status);

        const useDropdown = `
          <td class="status-cell">
            <div class="custom-dropdown">
              <div class="selected-stock-option">
                <img src="../images/${useImage}" class="product-status-icon">
              </div>
            </div>
          </td>
        `;

        const statusDropdown = `
          <td class="status-cell status">
            <div class="custom-dropdown">
              <div class="selected-stock-option" onclick="toggleDropdown(this)">
                <img src="../images/${statusImage}" class="order-status-icon"><img src="../images/underway.svg" class="small-icon">
              </div>
              <ul class="dropdown-stock-options">
                <li data-value="checking.svg" onclick="selectOrderOption(this)">
                  <img src="../images/checking.svg">
                </li>
                <li data-value="indelivery.svg" onclick="selectOrderOption(this)">
                  <img src="../images/indelivery.svg">
                </li>
                <li data-value="deliverycomplete.svg" onclick="selectOrderOption(this)">
                  <img src="../images/deliverycomplete.svg">
                </li>
              </ul>
            </div>
          </td>
        `;

        const row = document.createElement("tr");
        row.classList.add("order");
        row.setAttribute("data-branch", branch);
        row.setAttribute("data-product-status", useImage);
        row.setAttribute("data-current-selection", statusImage);
        row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.officeName}</td>
          <td>${order.menuName}</td>
          <td>${order.quantity}</td>
          ${useDropdown}
          ${statusDropdown}
        `;
        tbody.appendChild(row);
      });

      addEmptyRows('stock-table-body');
      checkForData('#stock-table-body', '.no-data');  
    })
    .catch(err => console.error("❌ 발주 데이터 불러오기 실패:", err));
}

var modal = document.querySelector(".modal");
var orderStatusToast = document.getElementById("orderStatusToast");
  
function showToast(message) {
  const orderStatusToast = document.getElementById("orderStatusToast");
  orderStatusToast.querySelector('.toast-message').textContent = message;
    orderStatusToast.style.display = 'flex';
    setTimeout(() => {
      orderStatusToast.style.display = 'none';
    }, 3000);
}

function toggleDropdown(element) {
  const options = element.nextElementSibling;
  options.style.display = options.style.display === 'block' ? 'none' : 'block';
}

function closeAll(element) {
  const dropdown = element.closest('.dropdown-stock-options');
  modal = document.querySelector('.modal');
  dropdown.style.display = 'none';
  modal.style.display = 'none';
}

function updateOrderStatusIcon(element) {
  const selectedImg = element.parentNode.previousElementSibling;
  selectedImg.querySelector(".order-status-icon").src = `../images/${element.dataset.value}`;
}
let currentStatusConfirmHandler = null;

function selectOrderOption(element) {
  const statusConfirmModal = document.getElementById('statusConfirmModal');
  const statusConfirmYesBtn = document.getElementById('statusConfirmYes');
  const statusConfirmNoBtn = document.getElementById('statusConfirmNo');
  statusConfirmModal.style.display = 'flex';

  modal?.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  })
  
  if (currentStatusConfirmHandler) {
    statusConfirmYesBtn.removeEventListener('click', currentStatusConfirmHandler);
  }

  currentStatusConfirmHandler = function () {
     const temp = element.parentNode.parentNode.parentNode.parentNode;
    const row = temp.querySelector('td');
    const id = row.innerText;
    closeAll(element);
    updateOrderStatusIcon(element);
    showToast("발주상태가 변경되었습니다.");
    fetchPutOrder(id, setStatus(`${element.dataset.value}`));
  };

  statusConfirmYesBtn.addEventListener('click', currentStatusConfirmHandler);

  statusConfirmNoBtn.onclick = () => closeAll(element);
}

function fetchPutOrder(id, status) {
  fetch(`http://tomhoon.duckdns.org:8882/api/stock/header/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      status: `${status}`,
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  });
}