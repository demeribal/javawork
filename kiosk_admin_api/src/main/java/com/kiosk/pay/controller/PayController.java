package com.kiosk.pay.controller;


import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kiosk.pay.DTO.PayDTO;
import com.kiosk.pay.model.Pay;
import com.kiosk.pay.service.PayService;

@RestController
@RequestMapping("/api/pay")

public class PayController {
	
	@Autowired
    PayService payService;

    @PostMapping
    public ResponseEntity<Void> createPay(@RequestBody PayDTO paydto) {
    	System.out.println("받은 결제 정보: " + paydto);
        payService.createPay(paydto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public List<Pay> getPays(
        @RequestParam(required = false) String fromDate,
        @RequestParam(required = false) String toDate,
        @RequestParam(defaultValue = "desc") String order
    ) {
        if (fromDate != null && toDate != null) {
            return payService.getPaysBetweenDates(fromDate, toDate, order);
        } else {
            return payService.getAllPayOrdered(order);
        }
    }

    //API: GET /api/pay/success
    @GetMapping("/success")
    public ResponseEntity<String> handleTossSuccess(
        @RequestParam String paymentKey,
        @RequestParam String orderId,
        @RequestParam int amount
    ) throws Exception {
        JSONObject approvedPayment = confirmWithToss(paymentKey, orderId, amount);

        if (approvedPayment == null || !"DONE".equals(approvedPayment.get("status"))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("결제 승인 실패");
        }

        PayDTO dto = new PayDTO();
        dto.setPaycode(orderId);
        dto.setPaymentmethod("카드");
        dto.setPaymenthistory("김밥, 떡볶이");
        dto.setAmount(amount);
        dto.setPaidat(java.time.LocalDateTime.now());
        dto.setOfficeId(1);   

        payService.createPay(dto);
        return ResponseEntity.ok("✅ 결제 승인 및 저장 성공");
    }

    public JSONObject confirmWithToss(String paymentKey, String orderId, int amount) throws Exception {
        JSONParser parser = new JSONParser();

        JSONObject obj = new JSONObject();
        obj.put("orderId", orderId);
        obj.put("amount", amount);
        obj.put("paymentKey", paymentKey);

        String secretKey = "test_sk_..."; // 실제 secret key로 교체!
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode((secretKey + ":").getBytes(StandardCharsets.UTF_8));
        String authorizations = "Basic " + new String(encodedBytes);

        URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("Authorization", authorizations);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);

        OutputStream outputStream = connection.getOutputStream();
        outputStream.write(obj.toString().getBytes("UTF-8"));

            InputStream responseStream = connection.getResponseCode() == 200 ?
                connection.getInputStream() : connection.getErrorStream();

            Reader reader = new InputStreamReader(responseStream, StandardCharsets.UTF_8);
            return (JSONObject) parser.parse(reader);
        }
    

    
}