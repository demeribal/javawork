package com.kiosk.stock.header.model;

import java.time.LocalDateTime;

import com.kiosk.stock.header.model.StockHeader;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class StockHeader {
	private int id;
    private String officeName;
    private String menuName;
    private int quantity;
    private boolean isUse;
    private String status;
    private LocalDateTime lastUpdate;
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
 