package com.kiosk.order.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kiosk.order.mapper.OrderMapper;
import com.kiosk.order.model.Orders;
import com.kiosk.order.model.OrdersDTO;

@Service
public class OrderService {

	@Autowired
	OrderMapper mapper;

	public void register(Orders order) {
		mapper.insert(order);
	}
	
	public List<Orders> getAllOrders() {
		return mapper.findAll();
	}

	public Optional<Orders> getOrderById(int id) {
		return mapper.findById(id);
	}

	public Orders updateOrder(Orders order) {
		return mapper.update(order);
	}
	
	public int deleteOrder(int id) {
		return mapper.delete(id);
	}
}
