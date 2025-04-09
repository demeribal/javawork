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

@CrossOrigin(origins = "http://192.168.0.20:5500") //vscode 실행 시 나오는 url과 일치
@RestController
@RequestMapping("/api")
public class OrderRestController {
	
	@Autowired
	OrderService service;
	
	@PostMapping("order") 
	public ResponseEntity <Map<String,Object>> postOrder(
			@ModelAttribute OrdersDTO orderdto) {
		System.out.println(orderdto.getInventoryId());
		System.out.println(orderdto.getMenuId());
		System.out.println(orderdto.getQuantity());
		//위 데이터를 mybatis를 이용해 db에 저장
		//db저장 전 책 이미지 파일을 저장하고 데이터를 db에 저장
		/********************코드 작성**********************/
		//리턴할 상세정보를 Map을 이용하여 저장할 파일을 초기화
		Map<String,Object> response = new HashMap<>();
		
		//db에 정보를 저장(dto에 있는 값을 전달하여 mybatis로 처리)
		Orders order = Orders.builder()
				.inventoryId(orderdto.getInventoryId())
				.menuId(orderdto.getMenuId())
				.status("확인중")
				.quantity(orderdto.getQuantity())
				.lastUpdate(LocalDateTime.now())
				.build();
		service.register(order);
		order = service.getOrderByDTO(orderdto);
		
		//클라이언트에게 성공 또는 실패 정보를 제공
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
				.inventoryId(order.getInventoryId())
				.menuId(order.getMenuId())
				.status(status)
				.quantity(order.getQuantity())
				.lastUpdate(LocalDateTime.now())
				.build();
		//파일 다시 저장 코드 입력
		order=service.updateOrder(updateorder);
		if (order!= null) {
			return new ResponseEntity<>( HttpStatus.OK);
		} else {
			return new ResponseEntity<>( HttpStatus.NOT_FOUND); //In case
		}
	}

	//삭제
	@DeleteMapping("order/{id}")
	public ResponseEntity<String> deleteBook(@PathVariable int id){
		int result = service.deleteOrder(id);
		
		if (result!= 0) {
			return new ResponseEntity<>(HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); //In case
		}
	}
}
