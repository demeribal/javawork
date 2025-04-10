package com.kiosk.login.entity;

import lombok.Data;

@Data
public class User {
	private Integer id;
    private String username;
    private String password;
    private boolean isHead;

}
