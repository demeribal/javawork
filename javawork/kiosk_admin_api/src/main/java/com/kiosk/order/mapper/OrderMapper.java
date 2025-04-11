package com.kiosk.order.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.kiosk.order.model.Orders;
import com.kiosk.order.model.OrdersDTO;

@Mapper
public interface OrderMapper {
	void insert(Orders order);
	List<Orders> findAll();
	Optional<Orders> findById(int id);
	Orders update(Orders order);
	int delete(int id);
}
