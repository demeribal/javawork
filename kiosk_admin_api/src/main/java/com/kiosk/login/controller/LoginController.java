package com.kiosk.login.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

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
	    System.out.println("로그인 요청 들어옴!"); // 디버깅용 추후에 삭제
	    System.out.println("입력값: " + loginDTO); // 디버깅용 추후에 삭제
	    
	    String recaptchaToken = loginDTO.getRecaptchaToken();
	    if (!verifyRecaptcha(recaptchaToken)) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "reCAPTCHA 인증 실패"));
	    }

	    String username = loginDTO.getUsername();
	    String password = loginDTO.getPassword();

	    User user = loginService.findByUsername(username);

	    if (user != null && user.getPassword().equals(password)) {
	        HttpSession session = request.getSession();
	        session.setAttribute("user", user);               // 전체 user 객체 저장
	        session.setAttribute("userId", user.getId());      // 추가: userId만 따로 저장

	        System.out.println("user.isHead(): " + user.isHead()); // 디버깅용 추후에 삭제
	        System.out.println("입력된 username: " + username);
	        System.out.println("입력된 password: " + password);
	        User user1 = loginService.findByUsername(username);
	        System.out.println("로그인한 유저: " + user1);
	        return ResponseEntity.ok(Map.of(
	            "message", "로그인 성공",
	            "isHead", user.isHead()
	            //로그인한 사람에 대한 office 정보 넘기기
	            
	        ));
	    }

	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
	        "message", "로그인 실패"
	    ));
	}

	
	private boolean verifyRecaptcha(String token) {
<<<<<<< HEAD
	    String secret ="6LegjhwrAAAAAKvCs6RcSUSjeCyk3btxjkek3CIE";
=======
	    String secret = "6LegjhwrAAAAAKvCs6RcSUSjeCyk3btxjkek3CIE";
>>>>>>> upload
	    String url = "https://www.google.com/recaptcha/api/siteverify";

	    RestTemplate restTemplate = new RestTemplate();

	    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
	    params.add("secret", secret);
	    params.add("response", token);

	    try {
<<<<<<< HEAD
	        Map<String, Object> response = restTemplate.postForObject(url, params, Map.class);
	        if (response != null && Boolean.TRUE.equals(response.get("success"))) {
	            Double score = (Double) response.get("score");
	            System.out.println("리캡챠 점수: " + score);
	            return score >= 0.5; // 0.5 이상이면 통과
=======
	        // 리캡챠 확인 요청
	        Map<String, Object> response = restTemplate.postForObject(url, params, Map.class);
	        
	        // "success"가 true이면 인증 성공
	        if (response != null && Boolean.TRUE.equals(response.get("success"))) {
	            return true;
>>>>>>> upload
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
<<<<<<< HEAD
	    return false;
=======
	    return false;  // 인증 실패
	    
>>>>>>> upload
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
