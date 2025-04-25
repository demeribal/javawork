package com.kiosk.pay.DTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PayDTO {
    private int id;                 // 결제 식별자
    private int officeId;
    private String paycode;
    private String paymentmethod;  // 결제수단
    private String paymenthistory;  
    private String flavors;
    private int amount;            // 결제금액
    private LocalDateTime paidat;  // 결제일
    private String storeLocation;   // office_name 조인 정보
}
