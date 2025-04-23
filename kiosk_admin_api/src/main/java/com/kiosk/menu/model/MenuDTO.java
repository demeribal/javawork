package com.kiosk.menu.model;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class MenuDTO {
	private int id;
    private String menuName;
    private String menuCode;
    private String imagePath;
    private Boolean isUse;
}
