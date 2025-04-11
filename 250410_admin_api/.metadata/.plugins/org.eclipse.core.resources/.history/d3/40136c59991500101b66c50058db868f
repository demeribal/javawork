package com.kiosk.pay.paycontroller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kiosk.pay.model.Pay;
import com.kiosk.pay.payDTO.PayDTO;
import com.kiosk.pay.payservice.PayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pay")
@CrossOrigin("http://192.168.0.35:5500")

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
    public List<Pay> getPays() {
        return payService.getAllPay();
    }
}

