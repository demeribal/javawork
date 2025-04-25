package com.kiosk.pay.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kiosk.pay.mapper.PayMapper;
import com.kiosk.pay.model.Pay;
import com.kiosk.pay.DTO.PayDTO;

@Service
public class PayService {
	
	@Autowired
	PayMapper mapper;

	public void createPay(Pay pay) {
		mapper.insert(pay);
	}
	
	public List<PayDTO> getPaysBetweenDates(String fromDate, String toDate, String order) {
	    return mapper.getPaysBetweenDates(fromDate, toDate, order);
	}

	public List<PayDTO> getAllPayOrdered(String order) {
	    return mapper.getAllPayOrdered(order);
	}

}
