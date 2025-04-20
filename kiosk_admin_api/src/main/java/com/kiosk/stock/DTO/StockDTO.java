package com.kiosk.stock.DTO;

import lombok.Data;

@Data
public class StockDTO {
    private int id;         // 재고 ID (PK)
    private int menuId;     // 메뉴 ID (FK)
    private int officeId;   // 가맹점 ID (FK)
    private int orderId;    // 발주ID(PK)
    private int quantity;   // 재고 수량
    private boolean isUse;  // 사용 여부
}
