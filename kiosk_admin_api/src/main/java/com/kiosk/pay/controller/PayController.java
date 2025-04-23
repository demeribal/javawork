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
    
    @GetMapping("/admin")
    public List<PayDTO> getPayAdminView() {
        return payService.getPayWithMenuAndOffice();
    }


}