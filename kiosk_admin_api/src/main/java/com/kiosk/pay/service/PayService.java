package com.kiosk.pay.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kiosk.pay.mapper.PayMapper;
import com.kiosk.pay.model.Pay;
import com.kiosk.pay.model.PayDTO;

@Service
public class PayService {
	
	@Autowired
	PayMapper mapper;

	public void createPay(PayDTO paydto) {
		Pay pay = new Pay();
		BeanUtils.copyProperties(paydto, pay);
		mapper.insert(paydto);
	}

	public List<Pay> getAllPay() {
		return mapper.getAllPay();
	}

	public List<Pay> getPaysFiltered(String date, String order) {
		return mapper.getPaysFiltered(date, order);
	}
	
	public List<Pay> getPaysBetweenDates(String fromDate, String toDate, String order) {
	    return mapper.getPaysBetweenDates(fromDate, toDate, order);
	}

	public List<Pay> getAllPayOrdered(String order) {
	    return mapper.getAllPayOrdered(order);
	}

}
