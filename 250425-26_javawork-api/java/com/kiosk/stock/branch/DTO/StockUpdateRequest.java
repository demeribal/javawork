package com.kiosk.stock.branch.DTO;

import lombok.Data;

@Data
public class StockUpdateRequest {
    private String officeName;
    private String menuName;
    private int quantity; // 감소시킬 수량

    // 기본 생성자
    public StockUpdateRequest() {}
    
    // 전체 필드 생성자
    public StockUpdateRequest(String officeName, String menuName, int quantity) {
        this.officeName = officeName;
        this.menuName = menuName;
        this.quantity = quantity;
    }
}