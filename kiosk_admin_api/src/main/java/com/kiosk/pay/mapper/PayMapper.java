package com.kiosk.pay.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.kiosk.pay.model.Pay;
import com.kiosk.pay.model.PayDTO;

@Mapper
public interface PayMapper{
	void insert(PayDTO paydto);
	
	List<Pay> getAllPay();
	List<Pay> getPaysFiltered(String date, String order);
	List<Pay> getPaysBetweenDates(@Param("fromDate") String fromDate, @Param("toDate") String toDate, @Param("order") String order);
	List<Pay> getAllPayOrdered(@Param("order") String order);
}