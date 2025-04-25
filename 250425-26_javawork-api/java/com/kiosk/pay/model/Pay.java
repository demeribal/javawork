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
    private int officeId;
    private String paycode;
    private String paymentmethod;
    private String paymenthistory;
    private String flavors;
    private int amount;
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
);


CREATE TABLE pay (
	id INT(11) NOT NULL AUTO_INCREMENT,
	office_id INT(11) NOT NULL,
	pay_code VARCHAR(255) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	payment_method VARCHAR(50) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	payment_history TEXT NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	flavors TEXT NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	amount INT(11) NOT NULL,
	paid_at DATETIME NOT NULL,
	PRIMARY KEY (id) USING BTREE,
	INDEX pay_idfk_1 (office_id) USING BTREE,
	CONSTRAINT pay_ibfk_1 FOREIGN KEY (office_id) REFERENCES office (id) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=57
*/

