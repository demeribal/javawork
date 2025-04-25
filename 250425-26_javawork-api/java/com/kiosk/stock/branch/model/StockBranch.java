package com.kiosk.stock.branch.model;

import lombok.Data;

@Data
public class StockBranch {
    private int id;         // 재고 ID (PK)
    private int menuId;     // 메뉴 ID (FK)
    private int officeId;   // 가맹점 ID (FK)
    private int quantity;
    private boolean isUse;
}