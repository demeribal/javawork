package com.kiosk.stock.DTO;

import lombok.Data;

@Data
public class StockDTO {
	private int id;
	private String officeName;
	private String MenuName;
	private String imagePath;
	private int quantity;
	private boolean isUse;
	private String status;
}