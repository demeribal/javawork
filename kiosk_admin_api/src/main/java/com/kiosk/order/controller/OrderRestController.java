package com.kiosk.order.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kiosk.order.model.Orders;
import com.kiosk.order.model.OrdersDTO;
import com.kiosk.order.service.OrderService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://192.168.0.35:5500") //vscode 실행 시 나오는 url과 일치
public class OrderRestController {
	
	@Autowired
	OrderService service;

	@PostMapping("order") 
	public ResponseEntity <Map<String,Object>> postOrder(
			@ModelAttribute OrdersDTO orderdto) {
		System.out.println(orderdto.getQuantity());
		
		Map<String,Object> response = new HashMap<>();
		
		Orders order = Orders.builder()
				.status("확인중")
				.quantity(orderdto.getQuantity())
				.lastUpdate(LocalDateTime.now())
				.build();
		service.register(order);
		
		response.put("status", "success");
		response.put("messsage", "주문 등록 완료!");
		response.put("id", order.getId());
		return new ResponseEntity<>(response,HttpStatus.OK);
	}

	@GetMapping("orders")
	public ResponseEntity<Map<String, Object>> getList() {
		Map<String, Object> response = new HashMap<>();
		try {
			List<Orders> orders = service.getAllOrders();
			
			if(orders.isEmpty()) {
				response.put("status", "error");
				response.put("message", "No orders found!");
				return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
			}
			
			response.put("status", "success");
			response.put("message", "Orders retrieved successfully");
			response.put("orders", orders);
			
			return new ResponseEntity<>(response, HttpStatus.OK);
		} catch(Exception e) {
			e.printStackTrace();
			response.put("status", "error");
			response.put("message", "Failde to retrieve orders");
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	//선택출력
	@GetMapping("order/{id}")
	public ResponseEntity<Orders> getOrderById(@PathVariable int id) {
		return service.getOrderById(id)
				.map(order -> ResponseEntity.ok().body(order))
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	//수정
	@PutMapping("order/{id}")
	public ResponseEntity<Orders> putBook(@PathVariable int id, @ModelAttribute String status){
		Orders order=service.getOrderById(id).get();
		Orders updateorder=Orders.builder()
				.id(order.getId())
				.status(status)
				.quantity(order.getQuantity())
				.lastUpdate(LocalDateTime.now())
				.build();
		//파일 다시 저장 코드 입력
		order=service.updateOrder(updateorder);
		if (order!= null) {
			return new ResponseEntity<>( HttpStatus.OK);
		} else {
			return new ResponseEntity<>( HttpStatus.NOT_FOUND);
		}
	}

	//삭제
	@DeleteMapping("order/{id}")
	public ResponseEntity<String> deleteBook(@PathVariable int id){
		int result = service.deleteOrder(id);
		
		if (result!= 0) {
			return new ResponseEntity<>(HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
