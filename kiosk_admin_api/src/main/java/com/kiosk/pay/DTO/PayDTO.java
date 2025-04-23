package com.kiosk.pay.DTO;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class PayDTO {
    private int id;                 // 결제 식별자
    private String paymentmethod;  // 결제수단
    private String paymenthistory;  
    private int amount;            // 결제금액
    private LocalDateTime paidat;  // 결제일
    private String paycode;
    private String storeLocation;
    private Integer stockId;
    private String menuCodes; // ex) ICE101, ICE102
    private List<Integer> menuIds; // stock 연동용
}
