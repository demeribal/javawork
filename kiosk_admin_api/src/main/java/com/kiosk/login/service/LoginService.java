package com.kiosk.login.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kiosk.login.entity.User;
import com.kiosk.login.repository.LoginMapper;


@Service
public class LoginService {
	
	@Autowired
	LoginMapper loginmapper;

	public User findByUsername(String username) {

		return loginmapper.findByUsername(username);
	}

	public List<User> getAllUsers() {
		return loginmapper.findAll();
	}

	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public boolean checkPassword(String rawPassword, String hashedPassword) {
    	
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }



}