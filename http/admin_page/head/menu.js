document.addEventListener("DOMContentLoaded", () => {
  console.log("📄 DOMContentLoaded 이벤트 발생 - initMenuPage() 실행");
  initMenuPage();
});

function initMenuPage() {
  fetchMenuData();

  const openModalBtn = document.getElementById("openModalBtn");
  const menuModal = document.getElementById("menuAddModal");
  if (openModalBtn && menuModal) {
    openModalBtn.addEventListener("click", () => {
      menuModal.style.display = "flex";
    });
  }

  // ✅ 파일 업로드 관련 요소
  const fileInput = document.getElementById("fileInput");
  const browseLink = document.querySelector(".browse-link");
  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  const deleteImageBtn = document.getElementById("deleteImageBtn");
  const defaultUploadIcon = document.getElementById("defaultUploadIcon");
  const dropText = document.getElementById("dropText");

  if (browseLink && fileInput) {
    browseLink.addEventListener("click", (e) => {
      e.preventDefault();
      fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreviewContainer.style.display = "flex";
          defaultUploadIcon.style.display = "none";
          dropText.style.display = "none";
          document.getElementById("fileName").textContent = file.name;
        };
        reader.readAsDataURL(file);
      
      // ✅ 메뉴명 바뀔 때마다 파일명 텍스트 업데이트
      document.getElementById("menuName").addEventListener("input", () => {
        const ext = file.name.split('.').pop();
        const name = document.getElementById("menuName").value.trim();
        document.getElementById("fileName").textContent = `${name}.${ext}`;
      });
    }
  });
}
  
  // ✅ fileInput 블록 밖에서 delete 버튼 처리
  if (deleteImageBtn) {
    deleteImageBtn.addEventListener("click", () => {
      fileInput.value = "";
      imagePreview.src = "#";
      imagePreviewContainer.style.display = "none";
      defaultUploadIcon.style.display = "block";
      dropText.style.display = "block";
    });
  }

  // ✅ 등록 버튼 → 확인 모달
  const registerBtn = document.getElementById("registerMenuBtn");
  const menuConfirmModal = document.getElementById("menuConfirmModal");
  const confirmMenuName = document.getElementById("confirmMenuName");

  if (registerBtn && menuConfirmModal) {
    registerBtn.addEventListener("click", () => {
      const menuName = document.getElementById("menuName").value.trim();
      if (!menuName) {
        alert("메뉴명을 입력해주세요.");
        return;
      }
      confirmMenuName.textContent = `정말 "${menuName}"을 등록하시겠습니까?`;
      menuConfirmModal.style.display = "flex";
    });
  }
 



// ✅ 메뉴 등록 확정
const confirmYes = document.getElementById("menuConfirmYes");
confirmYes?.addEventListener("click", () => {
  createMenu();
});

function createMenu() {
  const menuName = document.getElementById("menuName").value.trim();
  const menuCode = document.getElementById("menuCode").value.trim();
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!menuName || !menuCode) {
    alert("메뉴명과 코드를 입력해주세요.");
    return;
  }

  // 🔧 이미지 파일명을 메뉴명으로 바꾸기
  let renamedFile = null;
  if (file) {
    const extension = file.name.split('.').pop();
    const newFileName = `${menuName}.${extension}`;
    renamedFile = new File([file], newFileName, { type: file.type });
  }

  // 🔧 FormData 구성
  const formData = new FormData();
  formData.append("menuName", menuName);
  formData.append("menuCode", menuCode);
  formData.append("isUse", true);
  if (renamedFile) {
    formData.append("image", renamedFile);
  }

  // 🔧 API 요청
  fetch("http://localhost:8080/api/menus", {
    method: "POST",
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("서버 응답 오류");
      return res.json();
    })
    .then(data => {
      console.log("📦 등록 성공:", data.message);
      document.getElementById("menuConfirmModal").style.display = "none";
      document.getElementById("menuAddModal").style.display = "none";

      // ✅ 메뉴 등록 성공 toast
      showToast("메뉴등록이 완료되었습니다.");

      fetchMenuData();
    })
    .catch(err => {
      console.error("❌ 메뉴 등록 실패:", err);
      alert("메뉴 등록에 실패했습니다.");
    });
  }
}


window.initMenuPage = initMenuPage;


// 메뉴 리스트 조회
function fetchMenuData() {
    fetch("http://localhost:8080/api/menus")
        .then(res => {
            if (!res.ok) throw new Error("응답 실패");
            return res.json();
        })
        .then(data => {
            renderMenuList(data);
        })
        .catch(err => {
        });
}


// 메뉴 리스트 렌더링
function renderMenuList(menuList) {
  const tableBody = document.getElementById('menu-table-body');
  tableBody.innerHTML = '';

  menuList.forEach((menu, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${menu.menuName}</td>
      <td>${menu.menuCode}</td>
      <td>${menu.imagePath || ''}</td>
      <td>
        <input type="checkbox" class="isUse-checkbox" data-id="${menu.id}" ${menu.isUse !== false ? 'checked' : ''}>
      </td>
      <td></td>
    `;

    tableBody.appendChild(row);
  });

  const checkboxes = document.querySelectorAll('.isUse-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function () {
      const menuId = this.getAttribute('data-id');
      const currentIsUse = this.checked;
      toggleIsUse(menuId, currentIsUse);
    });
  });
}

  var modals = document.querySelectorAll('.modal');
  // 메뉴추가 모달 외부 클릭 시 모달 닫기
  modals.forEach(modal=>{
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  })
  
  // PATCH 요청 보내기
  function updateIsUse(menuId, newValue) {
    fetch(`http://localhost:8080/api/menus/${menuId}/isUse`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isUse: newValue })
    })
    .then(res => res.json())
    .then(() => {
      alert("상태가 업데이트되었습니다.");
      fetchMenuData(); // 최신 목록 다시 불러오기
    });
  }
  
  // 모달 보여주기
  function showModal(onConfirm) {
    const modal = document.getElementById("statusConfirmModal");
    const yesBtn = document.getElementById("statusConfirmYes");
    const noBtn = document.getElementById("statusConfirmNo");
  
    modal.style.display = "flex";
  
    // 이벤트 중복 방지
    yesBtn.onclick = () => {
      modal.style.display = "none";
      onConfirm(); // ✅ 확인 시 실행
    };
  
    noBtn.onclick = () => {
      modal.style.display = "none";
    };
  }
  

// 메뉴 사용 여부 상태 변경 함수 (리팩토링 완료)
function updateMenuStatus(menuId, isUseValue) {
  fetch(`http://localhost:8080/api/menus/${menuId}/isUse`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ isUse: isUseValue }) // ✅ 단일 필드만 전송
  })
    .then(res => {
      if (!res.ok) throw new Error("판매 상태 변경 실패");
      return res.json();
    })
    .then(data => {
      showToast("판매 상태가 변경되었습니다.");
      fetchMenuData(); // 최신 메뉴 목록 다시 불러옴
    })
    .catch(err => {
      alert("판매 상태 변경 중 오류가 발생했습니다.");
    });
}


// 토스트 요소를 안전하게 가져오기
function getToastElement() {
  const toast = document.getElementById('statusToast');
  if (!toast) {
    console.error('토스트 요소를 찾을 수 없습니다');
    return null;
  }
  return toast;
}

// 안전한 토스트 표시 함수
function showToast(message) {
  const toast = getToastElement();
  if (!toast) {
    console.warn('토스트 요소 없음. 대체로 alert 사용');
    alert(message); // 토스트 없을 경우 대체 처리
    return;
  }

  const messageElement = toast.querySelector('.toast-message');
  if (messageElement) {
    messageElement.textContent = message;
    toast.style.display = 'flex';
    
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }
}

// 상태 변경 함수 보완
function toggleIsUse(menuId, newValue) {
  fetch(`http://localhost:8080/api/menus/${menuId}/isUse`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isUse: newValue })
  })
  .then(res => {
    if (!res.ok) throw new Error("상태 변경 실패");
    return res.json();
  })
  .then(() => {
    showToast("판매상태가 변경되었습니다.");
    fetchMenuData();
  })
  .catch(err => {
    console.error("❌ 상태 변경 실패:", err);
    showToast("상태 변경에 실패했습니다.");
    
    // 체크박스 상태 원복
    const checkbox = document.querySelector(`.isUse-checkbox[data-id="${menuId}"]`);
    if (checkbox) {
      checkbox.checked = !newValue;
    }
  });
}