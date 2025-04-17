package com.kiosk.pay.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Pay {
    private int id;
    //private int orderId;
    private String paymentmethod;
    private String paymentstatus;
    private int amount;
    private int paycode;
    private LocalDateTime paidat;
    
}

/*
localhost:8080/h2-console db

CREATE TABLE pay (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  pay_code INT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  amount INT NOT NULL,
  paid_at TIMESTAMP NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
*/

