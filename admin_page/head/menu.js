// menu.js - API 연동 추가 버전
function initMenuPage() {
    // 페이지 로드 시 메뉴 데이터 가져오기
    fetchMenuData();
    
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

    // 판매상태 변경 확인 모달
    const statusConfirmModal = document.getElementById('statusConfirmModal');
    const statusConfirmYesBtn = document.getElementById('statusConfirmYes');
    const statusConfirmNoBtn = document.getElementById('statusConfirmNo');

    let currentCheckbox = null; // 현재 클릭한 체크박스를 저장

    // 예 버튼: 판매상태 변경 처리 (API 호출 로직 추가)
    statusConfirmYesBtn.addEventListener('click', function (e) {
        if (currentCheckbox) {
            const menuId = currentCheckbox.getAttribute('data-id');
            const newStatus = !currentCheckbox.checked;
            
            // API 호출로 상태 변경 처리
            updateMenuStatus(menuId, newStatus);
            
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

    // 폼 초기화 함수 추가
    function resetMenuForm() {
        document.getElementById('menuName').value = '';
        if (document.getElementById('menuCode')) {
            document.getElementById('menuCode').value = '';
        }
        resetFileUpload();
        
        // 수정 모드 초기화
        const editMenuId = document.getElementById('editMenuId');
        if (editMenuId) {
            editMenuId.value = '';
        }
        
        // 버튼 텍스트 원래대로
        const registerMenuBtn = document.getElementById('registerMenuBtn');
        if (registerMenuBtn) {
            registerMenuBtn.textContent = '등록하기';
        }
    }

    // 메뉴추가 버튼 클릭 시 모달 열기
    openModalBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
    
    // 메뉴추가 모달 외부 클릭 시 모달 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetMenuForm();
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
        e.stopPropagation(); // 이벤트 전파 중지 추가
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
        
        // 실제 파일 업로드는 폼 제출 시 처리
        console.log('파일 업로드 준비 완료:', file.name);
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
    });

    // 예 버튼: 메뉴 등록/수정 처리 (API 호출 로직 추가)
    menuConfirmYesBtn.addEventListener('click', function () {
        const menuName = document.getElementById('menuName').value.trim();
        const menuCode = document.getElementById('menuCode')?.value.trim() || '';
        const imagePath = fileNameElement.textContent || '/images/default.png';
        const editMenuId = document.getElementById('editMenuId')?.value;
        
        // 메뉴 데이터 객체 생성
        const menuData = {
            menuName: menuName,
            menuCode: menuCode,
            imagePath: imagePath,
            isUse: true
        };
        
        if (editMenuId) {
            // 수정 모드
            updateMenu(editMenuId, menuData);
        } else {
            // 등록 모드
            createMenu(menuData);
        }
    });
    
    // 아니요 버튼: 등록 확인 모달만 닫기
    menuConfirmNoBtn.addEventListener('click', function () {
        menuConfirmModal.style.display = 'none';
    });

    // 여기서부터 API 연동 함수들 추가 //

    // 메뉴 데이터 가져오기 - API 사용
    function fetchMenuData() {
        fetch("http://localhost:8080/api/menus/dto")
            .then(res => res.json())
            .then(data => {
                console.log("✅ 메뉴 데이터 불러오기 성공:", data);
                displayMenus(data);
            })
            .catch(err => {
                console.error("❌ 메뉴 데이터 불러오기 실패:", err);
                displayDefaultMenus();
            });
    }

    // 기본 메뉴 데이터 표시 (API 연결 실패 시)
    function displayDefaultMenus() {
        const defaultMenus = [
            {
                id: 1,
                menuName: '민트초코',
                menuCode: 'BR001',
                imagePath: '/images/mint.png',
                isUse: true
            },
            {
                id: 2,
                menuName: '사랑에빠진딸기',
                menuCode: 'BR002',
                imagePath: '/images/strawberryfallinlove.png',
                isUse: true
            },
            {
                id: 3,
                menuName: '엄마는외계인',
                menuCode: 'BR003',
                imagePath: '/images/momisalien.png',
                isUse: true
            }
        ];
        
        displayMenus(defaultMenus);
    }
    
    // 메뉴 데이터 생성
    function createMenu(menuData) {
        // 중요: 프론트엔드의 'isUse' → 백엔드의 'use'로 변환
        const apiMenu = {
            menuName: menuData.menuName,
            menuCode: menuData.menuCode,
            imagePath: menuData.imagePath,
            use: menuData.isUse // 필드명 매핑
        };
        
        fetch("http://localhost:8080/api/menus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiMenu)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("메뉴 등록 실패");
            }
        })
        .then(data => {
            console.log("✅ 메뉴 등록 성공:", data);
            menuConfirmModal.style.display = 'none';
            modal.style.display = 'none';
            resetMenuForm();
            showToast("메뉴 등록이 완료되었습니다.");
            fetchMenuData(); // 목록 새로고침
        })
        .catch(err => {
            console.error("❌ 메뉴 등록 실패:", err);
            alert("메뉴 등록에 실패했습니다.");
        });
    }
    
    // 메뉴 데이터 수정
    function updateMenu(id, menuData) {
        // 중요: 프론트엔드의 'isUse' → 백엔드의 'use'로 변환
        const apiMenu = {
            menuName: menuData.menuName,
            menuCode: menuData.menuCode,
            imagePath: menuData.imagePath,
            use: menuData.isUse // 필드명 매핑
        };
        
        fetch(`http://localhost:8080/api/menus/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiMenu)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("메뉴 수정 실패");
            }
            return res.json();
        })
        .then(data => {
            console.log("✅ 메뉴 수정 성공:", data);
            menuConfirmModal.style.display = 'none';
            modal.style.display = 'none';
            resetMenuForm();
            showToast("메뉴 수정이 완료되었습니다.");
            fetchMenuData(); // 목록 새로고침
        })
        .catch(err => {
            console.error("❌ 메뉴 수정 실패:", err);
            alert("메뉴 수정에 실패했습니다.");
        });
    }
    
    // 메뉴 상태 변경
    function updateMenuStatus(id, isActive) {
        // 백엔드에서 부분 업데이트를 지원하지 않으므로
        // 먼저 전체 메뉴 정보를 가져온 후 상태만 변경하여 업데이트
        fetch(`http://localhost:8080/api/stocks/menu/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("메뉴 정보 가져오기 실패");
                }
                return res.json();
            })
            .then(menu => {
                console.log(menu)
                console.log(menu.isUse)
                // 중요: 백엔드의 'use' 필드 사용
                menu.isUse = isActive; // 필드명 매핑
                console.log(isActive)

                return fetch(`http://localhost:8080/api/stocks/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(menu)
                });
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("메뉴 상태 변경 실패");
                }
                return res.json();
            })
            .then(data => {
                console.log("✅ 메뉴 상태 변경 성공:", data);
                showToast("판매상태가 변경되었습니다.");
                fetchMenuData(); // 목록 새로고침
            })
            .catch(err => {
                console.error("❌ 메뉴 상태 변경 실패:", err);
                alert("메뉴 상태 변경에 실패했습니다.");
            });
    }
    
    // 메뉴 삭제 (필요시 구현)
    function deleteMenu(id) {
        if (!confirm("정말로 이 메뉴를 삭제하시겠습니까?")) {
            return;
        }
        
        fetch(`http://localhost:8080/api/menus/${id}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("메뉴 삭제 실패");
            }
            return res.json();
        })
        .then(data => {
            console.log("✅ 메뉴 삭제 성공:", data);
            showToast("메뉴가 삭제되었습니다.");
            fetchMenuData(); // 목록 새로고침
        })
        .catch(err => {
            console.error("❌ 메뉴 삭제 실패:", err);
            alert("메뉴 삭제에 실패했습니다.");
        });
    }

    // 메뉴 목록 화면에 표시
    function displayMenus(menus) {
        // 테이블 본문 찾기
        const tableBody = document.getElementById('data-table-body');
        if (!tableBody) {
            console.warn('테이블 본문(tbody)을 찾을 수 없습니다.');
            return;
        }
        
        // 테이블 본문 비우기
        tableBody.innerHTML = '';

        // 각 메뉴 항목에 대한 행 추가
        menus.forEach((menu, index) => {
            const row = document.createElement('tr');
                
        // 중요: null 값을 명시적으로 체크
        const isChecked = menu.isUse === true;
            
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${menu.menuName}</td>
            <td>${menu.menuCode || ''}</td>
            <td>${menu.imagePath || ''}</td>
            <td>
                <input type="checkbox" class="checkbox" 
                    data-id="${menu.id}" ${isChecked ? 'checked' : ''}>
            </td>
            <td>
                <button class="edit-btn" data-id="${menu.id}">
                    <i class="edit-icon"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
        addEmptyRows('menu-table-body');
        checkForData('#menu-table-body', '.no-data');
     })
            
    
        
        // 체크박스 이벤트 리스너 추가
        const checkboxes = document.querySelectorAll('.checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', function(e) {
                e.preventDefault();
                currentCheckbox = checkbox;
                statusConfirmModal.style.display = 'flex';
            });
        });
        
        // 수정 버튼 이벤트 리스너 추가
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const menuId = this.getAttribute('data-id');
                openEditMenu(menuId);
            });
        });
    }
    
    // 메뉴 수정 모달 열기
    function openEditMenu(menuId) {
        // API에서 메뉴 정보 가져오기
        fetch(`http://localhost:8080/api/menus/${menuId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("메뉴 정보 가져오기 실패");
                }
                return res.json();
            })
            .then(menu => {
                // 중요: 'use'를 'isUse'로 변환
                menu.isUse = menu.use;
                
                // 수정 모달 열기
                const modal = document.getElementById('menuAddModal');
                modal.style.display = 'flex';
                
                // 모달에 데이터 설정
                document.getElementById('menuName').value = menu.menuName || '';
                if (document.getElementById('menuCode')) {
                    document.getElementById('menuCode').value = menu.menuCode || '';
                }
                
                // 이미지 경로가 있으면 설정
                if (menu.imagePath) {
                    const fileNameElement = document.querySelector('.file-name');
                    const uploadInitial = document.getElementById('uploadInitial');
                    const uploadComplete = document.getElementById('uploadComplete');
                    
                    fileNameElement.textContent = menu.imagePath;
                    uploadInitial.style.display = 'none';
                    uploadComplete.style.display = 'flex';
                }
                
                // 폼 제출 처리 변경 (메뉴 수정용)
                const registerMenuBtn = document.getElementById('registerMenuBtn');
                registerMenuBtn.textContent = '수정하기';
                
                // 메뉴 ID 저장
                if (!document.getElementById('editMenuId')) {
                    const hiddenField = document.createElement('input');
                    hiddenField.type = 'hidden';
                    hiddenField.id = 'editMenuId';
                    document.getElementById('menuAddModal').appendChild(hiddenField);
                }
                document.getElementById('editMenuId').value = menuId;
            })
            .catch(err => {
                console.error("❌ 메뉴 정보 가져오기 실패:", err);
                alert("메뉴 정보를 불러오는데 실패했습니다.");
            });
    }
}

window.initMenuPage = initMenuPage;
