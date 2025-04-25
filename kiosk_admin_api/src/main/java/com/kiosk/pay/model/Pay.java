package com.kiosk.pay.model;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

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
    private int officeId;
    private String paycode;
    private String paymentmethod;
    private String paymenthistory;
    private int amount;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime paidat;
    private String flavors;
}

/*
CREATE TABLE pay (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '결제 식별자',
  office_id INT NOT NULL COMMENT `지점 식별자`,
  pay_code VARCHAR(255) NOT NULL COMMENT `결제 코드`,
  payment_method VARCHAR(50) NOT NULL COMMENT `결제 수단`,
  payment_history TEXT NOT NULL COMMENT `결제 내역`,
  amount INT NOT NULL COMMENT `결제금액`,
  paid_at TIMESTAMP NOT NULL COMMENT `결제일`,
  flavors TEXT NOT NULL COMMENT `결제 내역`,
  FOREIGN KEY (office_id) REFERENCES office(id)
);
*/

