package com.kiosk.pay.payservice;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kiosk.pay.model.Pay;
import com.kiosk.pay.payDTO.PayDTO;
import com.kiosk.pay.paymapper.PayMapper;

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
}
