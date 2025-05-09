package com.kiosk.login.controller;

import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kiosk.login.DTO.LoginDTO;
import com.kiosk.login.entity.User;
import com.kiosk.login.service.LoginService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/user")
public class LoginController {
	
	@Autowired
	LoginService loginService;
    
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO, HttpServletRequest request) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String encodedPassword2 = encoder.encode("1234");
		System.out.println(encodedPassword2);
	    System.out.println("로그인 요청 들어옴!");
	    System.out.println("입력값: " + loginDTO);

	    String username = loginDTO.getUsername();
	    String encodedPassword = loginDTO.getPassword();

	    // Base64 디코딩
	    byte[] decodedBytes = Base64.getDecoder().decode(encodedPassword);
	    String decodedPassword = new String(decodedBytes); // 평문 비밀번호
	    System.out.println("Encoded password: " + encodedPassword);
	    System.out.println("Decoded password: " + decodedPassword);
	    User user = loginService.findByUsername(username);

	    if (user != null && loginService.checkPassword(decodedPassword, user.getPassword())) {
	        HttpSession session = request.getSession();
	        session.setAttribute("user", user);
	        session.setAttribute("userId", user.getId());
	        
	        boolean passwordMatch = loginService.checkPassword(decodedPassword, user.getPassword());
		    System.out.println("DB 비밀번호 해시: " + user.getPassword());
		    System.out.println("입력된 평문 비밀번호: " + decodedPassword);
		    System.out.println("패스워드 일치 여부: " + passwordMatch);


	        return ResponseEntity.ok(Map.of(
	            "message", "로그인 성공",
	            "isHead", user.isHead()
	        ));
	    }
	    

	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인 실패"));
	}

	
	//user api
	@GetMapping("/all")
    public List<User> getAllUsers() {
        return loginService.getAllUsers();
    }
	
	//login user api
	@GetMapping("/info")
	public ResponseEntity<?> getUserInfo(HttpSession session) {
	    Object user = session.getAttribute("user"); 
	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 안됨");
	    }
	    return ResponseEntity.ok(user);
	}

}
