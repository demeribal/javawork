package com.kiosk.login.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kiosk.login.entity.User;
import com.kiosk.login.repository.Loginmapper;


@Service
public class LoginService {
	
	@Autowired
	Loginmapper loginmapper;

	public User findByUsername(String username) {

		return loginmapper.findByUsername(username);
	}



}