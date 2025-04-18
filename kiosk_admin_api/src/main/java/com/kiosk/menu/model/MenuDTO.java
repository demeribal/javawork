package com.kiosk.menu.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class MenuDTO {
    private int id;
    private String menuName;
    private boolean isUse;
    private String imagePath;
}
