package com.kiosk.stock.branch.DTO;

import lombok.Data;

@Data
public class StockBranchDTO {
    private int id;             // 재고 ID (PK)
    private int menuId;         // 메뉴 ID (menu 테이블에서 받아옴)
    private int officeId;       // 가맹점 ID (office 테이블에서 받아옴)
    private String officeName;  // 가맹점 이름 (office 테이블에서 받아옴)
    private String menuName;    // 메뉴 이름 (menu 테이블에서 받아옴)
    private String imagePath;   // 이미지 경로 (menu 테이블에서 받아옴)
    private int quantity;       // 재고 수량
    private boolean isUse;      // 사용 여부
    private String status;      // 상태
}