package com.kiosk.order.model;

import lombok.Data;

@Data
public class OrdersDTO {
	private int id;
	private String officeName;
	private String MenuName;
	private int quantity;
	private boolean isUse;
	private String status;
}
