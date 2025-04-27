package com.kiosk.pay.controller;

import java.util.List;

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
    public ResponseEntity<Void> createPay(@RequestBody Pay pay) {
    	System.out.println("받은 결제 정보: " + pay);
        payService.createPay(pay);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    
    @GetMapping
    public List<PayDTO> getPays(
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
}