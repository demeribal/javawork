package com.kiosk.stock.header.DTO;

import lombok.Data;

@Data
public class StockHeaderDTO {
    private int id;             // 주문 ID (PK)
    private String officeName;  // 지점명 (office 테이블에서 받아옴)
    private String menuName;    // 메뉴명 (menu 테이블에서 받아옴)
    private int quantity;       // 재고량
    private boolean isUse;      // 사용 여부 (stock 테이블에서 받아옴)
    private String status;      // 발주상태
    private String lastUpdate;  // 마지막 업데이트 시간 (필요시)
}