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
    private String paymentmethod;
    private String paymenthistory;
    private int amount;
    private String paycode;
    private LocalDateTime paidat;
    private Integer stockId;
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
);
*/

