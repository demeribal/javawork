package com.kiosk.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://127.0.0.1:5555")
@RestController
@RequestMapping("/api")
public class LoginController {
    
	@PostMapping("/login")
	public ResponseEntity<?> login( @RequestBody Map<String, String> loginData, HttpServletRequest request) {
		System.out.println("로그인 요청 들어옴!"); 		//디버깅용 추후에 삭제
        System.out.println("입력값: " + loginData);	//디버깅용 추후에 삭제
	        
        String username = loginData.get("username");
        String password = loginData.get("password");
        if ("admin".equals(username) && "1234".equals(password)) {
            HttpSession session = request.getSession();
            session.setAttribute("user", username);

            return ResponseEntity.ok(Map.of("message", "로그인 성공"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 실패"));
	}

}
