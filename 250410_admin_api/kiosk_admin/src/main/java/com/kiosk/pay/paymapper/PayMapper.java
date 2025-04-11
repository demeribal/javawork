package com.kiosk.pay.paymapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kiosk.pay.model.Pay;
import com.kiosk.pay.payDTO.PayDTO;

@Mapper
public interface PayMapper{
	void insert(PayDTO paydto);
	
	List<Pay> getAllPay();
}