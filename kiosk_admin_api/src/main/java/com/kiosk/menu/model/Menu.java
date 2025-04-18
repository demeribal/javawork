package com.kiosk.menu.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Menu {
	private int id;
	private String menuName;
    private boolean isUse;    // 사용 여부 (TINYINT → boolean)
    private String imagePath;
}

/*
localhost:8080/h2-console db

CREATE TABLE menu (
id INT AUTO_INCREMENT PRIMARY KEY,
menu_name VARCHAR(100) NOT NULL,
is_use BOOLEAN NOT NULL,
image_path VARCHAR(255)
);
*/