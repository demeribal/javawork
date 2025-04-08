package com.kiosk.pay.payDTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PayDTO {
    //private int orderId;
    private int paycode;
    private String paymentmethod;
    private String paymentstatus;
    private int amount;
    private LocalDateTime paidat;
}
