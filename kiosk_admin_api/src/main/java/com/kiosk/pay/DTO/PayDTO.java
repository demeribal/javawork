package com.kiosk.pay.DTO;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class PayDTO {
    private int id;                 // 결제 식별자
    private String paymentmethod;  // 결제수단
    private String paymenthistory;  
    private int amount;            // 결제금액
    private LocalDateTime paidat;  // 결제일
    private String storeLocation;  // 결제지점
    private String paycode;
}
