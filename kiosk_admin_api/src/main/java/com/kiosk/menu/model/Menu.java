package com.kiosk.menu.model;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Menu {
	private int id;
	private String menuName;
    private String menuCode;
    private String imagePath;
    private Boolean isUse;
}

/*
localhost:8080/h2-console db

CREATE TABLE menu (
id INT AUTO_INCREMENT PRIMARY KEY,
menu_name VARCHAR(100) NOT NULL,
menu_code String NOT NULL,
image_path VARCHAR(255)
);
*/