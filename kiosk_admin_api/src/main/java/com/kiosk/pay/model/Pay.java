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
<<<<<<< HEAD
    private String paymentmethod;
    private String paymenthistory;
    private int amount;
    private String paycode;
    private LocalDateTime paidat;
}

/*

CREATE TABLE pay (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '결제 식별자',
    paymentmethod VARCHAR(50) NOT NULL COMMENT '결제수단',
    paymenthistory VARCHAR(50) COMMENT '결제 내역',
    amount INT NOT NULL COMMENT '결제금액',
    paidat DATETIME COMMENT '결제일',
    store_location VARCHAR(100) COMMENT '결제지점',
    paycode VARCHAR(50) COMMENT '결제 코드'
=======
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
>>>>>>> upload
);
*/

