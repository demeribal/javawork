package com.kiosk.login.controller;

import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("++++++++++++++++++++++++++++++++++++++++");
        System.out.println("로그인 요청 들어옴!");
        System.out.println("입력값: " + loginDTO); // 디버깅용 추후에 삭제
        System.out.println("아이디" + loginDTO.getUsername());
        System.out.println("입력된 비밀번호: " + loginDTO.getPassword());
        System.out.println("리챠토큰"+ loginDTO.getRecaptchaToken());
        
        String username = loginDTO.getUsername();
        String encodedPassword = loginDTO.getPassword();
        
        // 비밀번호가 null인 경우 처리
        if (encodedPassword == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "비밀번호가 제공되지 않았습니다."));
        }

        String recaptchaToken = loginDTO.getRecaptchaToken();
        System.out.println(recaptchaToken);
        if (!verifyRecaptcha(recaptchaToken)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "reCAPTCHA 인증 실패"));
        }
        
        // Base64 디코딩
        byte[] decodedBytes = Base64.getDecoder().decode(encodedPassword);
        String decodedPassword = new String(decodedBytes);  // 평문 비밀번호
        System.out.println("Encoded password: " + encodedPassword);
        System.out.println("Decoded password: " + decodedPassword);
        
        User user = loginService.findByUsername(username);
        if (user != null && loginService.checkPassword(decodedPassword, user.getPassword())) {
            HttpSession session = request.getSession();
            session.setAttribute("user", user);  // 전체 user 객체 저장
            session.setAttribute("userId", user.getId());  // 추가: userId만 따로 저장

            return ResponseEntity.ok(Map.of(
                "message", "로그인 성공",
                "isHead", user.isHead()
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "message", "로그인 실패"
        ));
    }

    private boolean verifyRecaptcha(String token) {
        String secret = "6LegjhwrAAAAAKvCs6RcSUSjeCyk3btxjkek3CIE";
        String url = "https://www.google.com/recaptcha/api/siteverify";

        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("secret", secret);
        params.add("response", token);

        try {
            // 리캡챠 확인 요청
            Map<String, Object> response = restTemplate.postForObject(url, params, Map.class);
            System.out.println("리캡챠 응답: " + response);
            
            // "success"가 true이면 인증 성공
            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                return true; // 인증 성공
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false; // 인증 실패
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
