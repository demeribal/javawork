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
      confirmYes.addEventListener("click", () => {
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
          const extension = file.name.split('.').pop(); // 확장자 추출
          const newFileName = `${menuName}.${extension}`; // 새 파일명 = 메뉴명.확장자
          renamedFile = new File([file], newFileName, { type: file.type }); // 새 파일 생성
        }
  
        // 🔧 메뉴 JSON 데이터 준비
        const menuData = {
          menuName,
          menuCode,
          imagePath: "", // 서버에서 처리
          isUse: true
        };
  
        // 🔧 FormData 구성
      const formData = new FormData();
      formData.append("menuName", menuData.menuName);
      formData.append("menuCode", menuData.menuCode);
      formData.append("isUse", menuData.isUse); // true 또는 false (문자열로 보내도 무방)
      formData.append("image", renamedFile);    // ← 파일도 함께 전송
  
      if (renamedFile) {
        formData.append("image", renamedFile); // 이미지 첨부
      }
  
      // 🔧 메뉴 등록 API 호출
      fetch("http://tomhoon.duckdns.org:8882/api/menus", {
        method: "POST",
        body: formData
      })
        .then(res => {
          if (!res.ok) throw new Error("서버 응답 오류");
          return res.json();
          
        })
        .then(data => {
          console.log("📦 서버 응답 본문:", data.message);  // 로그 출력
          document.getElementById("menuConfirmModal").style.display = "none";
          document.getElementById("menuAddModal").style.display = "none";
          showToast("메뉴가 성공적으로 등록되었습니다.");
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
      fetch("http://tomhoon.duckdns.org:8882/api/menus")
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
    const tableBody = document.getElementById('data-table-body');
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
  
  
  
  // Toast 메시지 표시
  function showToast(message) {
    const toastEl = document.querySelector(".toast-message");
    if (!toastEl) {
      return;
    }
    toastEl.textContent = message;
  
    const toastWrapper = document.getElementById("statusToast");
    toastWrapper.classList.add("show");
  
    setTimeout(() => {
      toastWrapper.classList.remove("show");
    }, 3000);
  }
  
  
  // ✅ 판매 상태 변경 함수 추가
  function toggleIsUse(menuId, newValue) {
    fetch(`http://tomhoon.duckdns.org:8882/api/menus/${menuId}/isUse`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isUse: newValue })
    })
    .then(res => {
      return res.json();
    })
    .then(() => {
      alert("상태가 업데이트되었습니다.");
      fetchMenuData();
    })
    .catch(err => {
    });
  }
  
    
    // PATCH 요청 보내기
    function updateIsUse(menuId, newValue) {
      fetch(`http://tomhoon.duckdns.org:8882/api/menus/${menuId}/isUse`, {
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
    fetch(`http://tomhoon.duckdns.org:8882/api/menus/${menuId}/isUse`, {
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