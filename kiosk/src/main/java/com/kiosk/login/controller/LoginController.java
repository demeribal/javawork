package com.kiosk.login.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kiosk.login.DTO.LoginDTO;
import com.kiosk.login.entity.User;
import com.kiosk.login.service.LoginService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@CrossOrigin(origins ="http://127.0.0.1:5555", allowCredentials = "true")

@RestController
@RequestMapping("/api")
public class LoginController {
	
	@Autowired
	LoginService loginService;
    
	@PostMapping("/login")
	public ResponseEntity<?> login( @RequestBody LoginDTO loginDTO, HttpServletRequest request) {
		System.out.println("로그인 요청 들어옴!"); 		//디버깅용 추후에 삭제
        System.out.println("입력값: " + loginDTO);	//디버깅용 추후에 삭제
        
        String username = loginDTO.getUsername();
        String password = loginDTO.getPassword();

        User user = loginService.findByUsername(username);
        

        if (user != null && user.getPassword().equals(password)) {
            request.getSession().setAttribute("user", user);
            System.out.println("user.isHead(): " + user.isHead());//디버깅용 추후에 삭제
            System.out.println("입력된 username: " + username);
            System.out.println("입력된 password: " + password);

            return ResponseEntity.ok(Map.of("message", "로그인 성공","isHead", user.isHead()));
            
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 실패"));
	}

}
