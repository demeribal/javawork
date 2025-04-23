function initMenuPage() {
    // 토스트 메시지 요소
    const statusToast = document.getElementById('statusToast');
    
    // 토스트 메시지 표시 함수
    function showToast(message) {
        statusToast.querySelector('.toast-message').textContent = message;
        statusToast.style.display = 'flex';
        setTimeout(() => {
            statusToast.style.display = 'none';
        }, 3000);
    }

<<<<<<< Updated upstream
    // 판매상태 변경 확인 모달
    const statusConfirmModal = document.getElementById('statusConfirmModal');
    const statusConfirmYesBtn = document.getElementById('statusConfirmYes');
    const statusConfirmNoBtn = document.getElementById('statusConfirmNo');
=======
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
>>>>>>> Stashed changes

    // 체크박스 상태 변경 이벤트 리스너 추가
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    let currentCheckbox = null; // 현재 클릭한 체크박스를 저장

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function(e) {
            e.preventDefault();
            currentCheckbox = checkbox; // 현재 클릭한 체크박스 기억
            statusConfirmModal.style.display = 'flex';
        });
    });
            
    // 예 버튼: 모달 닫기 + 토스트 표시
    statusConfirmYesBtn.addEventListener('click', function (e) {
        if (currentCheckbox) {
            currentCheckbox.checked = !currentCheckbox.checked;
            showToast("판매상태가 변경되었습니다.");
            currentCheckbox = null;
        }
        statusConfirmModal.style.display = 'none';
    });
            
    // 아니요 버튼: 등록 확인 모달만 닫기
    statusConfirmNoBtn.addEventListener('click', function () {
        currentCheckbox = null;
        statusConfirmModal.style.display = 'none';
    });

    // 메뉴추가 모달 관련 요소
    const modal = document.getElementById('menuAddModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const clearBtn = document.querySelector('.clear-btn');
    
    // 파일 업로드 관련 요소
    const fileDropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadInitial = document.getElementById('uploadInitial');
    const uploadComplete = document.getElementById('uploadComplete');
    const fileNameElement = document.querySelector('.file-name');
    const deleteFileBtn = document.getElementById('deleteFileBtn');
    const browseLink = document.querySelector('.browse-link');

    // 메뉴추가 버튼 클릭 시 모달 열기
    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
    
    // 메뉴추가 모달 외부 클릭 시 모달 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 메뉴명 입력 필드 지우기 버튼
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            document.getElementById('menuName').value = '';
        });
    }
    
    // Browse 링크 클릭 시 파일 선택 다이얼로그 열기
    browseLink.addEventListener('click', function(e) {
        e.preventDefault();
        fileInput.click();
    });
    
    // 파일 드롭 영역 클릭 시 파일 선택 다이얼로그 열기
    fileDropZone.addEventListener('click', function(e) {
        // 삭제 버튼 클릭 시 이벤트 전파 방지
        if (e.target.closest('.delete-btn')) {
            return;
        }
        fileInput.click();
    });
    
    // 파일 선택 시 처리
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            handleFileUpload(file);
        }
    });
    
    // 드래그 앤 드롭 이벤트 처리
    fileDropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileDropZone.classList.add('dragover');
    });
    
    fileDropZone.addEventListener('dragleave', function() {
        fileDropZone.classList.remove('dragover');
    });
    
    fileDropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        fileDropZone.classList.remove('dragover');
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleFileUpload(file);
        }
    });
    
    // 파일 삭제 버튼 클릭 시
    deleteFileBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // 이벤트 전파 방지
        resetFileUpload();
    });
    
    // 파일 업로드 처리 함수
    function handleFileUpload(file) {
        // 이미지 파일만 허용
        if (!file.type.match('image.*')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }
        
        // 파일명 표시
        fileNameElement.textContent = file.name;
        
        // 업로드 완료 상태로 변경
        uploadInitial.style.display = 'none';
        uploadComplete.style.display = 'flex';
        
        // 여기에 실제 파일 업로드 로직 추가 (서버 연동 시)
        console.log('파일 업로드 완료:', file.name);
    }
    
    // 파일 업로드 상태 초기화 함수
    function resetFileUpload() {
        fileInput.value = ''; // 파일 입력 초기화
        fileNameElement.textContent = '';
        uploadComplete.style.display = 'none';
        uploadInitial.style.display = 'flex';
    }

    // 메뉴명 등록 확인 모달
    const menuConfirmModal = document.getElementById('menuConfirmModal');
    const menuConfirmYesBtn = document.getElementById('menuConfirmYes');
    const menuConfirmNoBtn = document.getElementById('menuConfirmNo');
    
    // 등록 버튼 클릭 시 확인 모달에 메뉴명 넣기
    document.getElementById('registerMenuBtn').addEventListener('click', function () {
        const menuName = document.getElementById('menuName').value.trim();
        if (!menuName) {
            alert("메뉴명을 입력해주세요.");
            return;
        }
        document.getElementById('confirmMenuName').textContent = `정말 "${menuName}"을 등록하시겠습니까?`;
        menuConfirmModal.style.display = 'flex';

        // 예 버튼: 모달 닫기 + 토스트 표시
        menuConfirmYesBtn.addEventListener('click', function () {
            menuConfirmModal.style.display = 'none';
            modal.style.display = 'none';
            fileNameElement.textContent = '';
            document.getElementById('menuName').value = '';
            document.getElementById('menuCode').value = '';
            resetFileUpload();
            showToast("메뉴등록이 완료되었습니다.");
        });

        // 아니요 버튼: 등록 확인 모달만 닫기
        menuConfirmNoBtn.addEventListener('click', function () {
            menuConfirmModal.style.display = 'none';
        });
    });
}
window.initMenuPage = initMenuPage;