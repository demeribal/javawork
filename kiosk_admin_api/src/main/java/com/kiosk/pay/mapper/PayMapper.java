package com.kiosk.pay.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.kiosk.pay.model.Pay;
import com.kiosk.pay.DTO.PayDTO;

@Mapper
public interface PayMapper{
	
	void insert(Pay pay);
	List<PayDTO> getPaysBetweenDates(@Param("fromDate") String fromDate, @Param("toDate") String toDate, @Param("order") String order);
	List<PayDTO> getAllPayOrdered(@Param("order") String order);
}
