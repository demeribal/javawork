package com.kiosk.message.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Message {
    private int id;                 // 문자 ID (PK)
    private int payId;              // 결제 ID (FK)
    private String phoneNumber;     // 전화번호
    private LocalDateTime sendTime; // 보낸 시간
    private boolean isSent;         // 전송 여부 (F:미전송 T전송 default False)
}
