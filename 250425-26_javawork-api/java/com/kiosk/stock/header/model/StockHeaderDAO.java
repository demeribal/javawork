package com.kiosk.stock.header.model;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class StockHeaderDAO {
  private int id;        // 주문 ID (PK)
  private String status;   // 주문 상태
  private LocalDateTime lastUpdate; // 마지막 업데이트 시간
}