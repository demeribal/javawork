package com.kiosk.stock.header.model;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class StockHeader {
  private int id;        // 주문 ID (PK)
  private int stockId;	  // 재고 ID (FK)
  private String status;   // 주문 상태
  private int quantity;    // 수량
  private LocalDateTime lastUpdate; // 마지막 업데이트 시간
}

/*
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT '확인중',
  quantity INT NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_id) REFERENCES inventory(id),
);
*/
 