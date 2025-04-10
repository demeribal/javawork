package com.kiosk.order.model;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Orders {
	private int id;
	private String status;
	private int quantity;
	private LocalDateTime lastUpdate;
}

/*
localhost:8080/h2-console db
application.propertise -> db설정, mapper등록
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT '확인중',
  quantity INT NOT NULL,
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_id) REFERENCES inventory(id),
);
*/
 