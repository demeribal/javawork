package com.kiosk.order.model;

import lombok.Data;

@Data
public class OrdersDTO {
	private int inventoryId;
	private int menuId;
	private int quantity;
}
