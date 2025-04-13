package com.kiosk.office.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kiosk.login.entity.User;
import com.kiosk.office.DTO.OfficeDTO;
import com.kiosk.office.service.OfficeService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/office")
@CrossOrigin(origins = "http://192.168.0.35:5500", allowCredentials = "true")
public class OfficeController {

    private final OfficeService officeService;

    @Autowired
    public OfficeController(OfficeService officeService) {
        this.officeService = officeService;
    }

    @GetMapping("/all")
    public List<OfficeDTO> getAllOffices() {
        return officeService.getAllOffices();
    }

    @GetMapping("/info")
    public ResponseEntity<?> getMyOffice(HttpSession session) {
        Object userObj = session.getAttribute("user");
        
        if (userObj == null) {
            System.out.println("세션에 user 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 먼저 해주세요");
        }
        
        if (!(userObj instanceof User)) {
            System.out.println("세션의 user 타입이 User가 아님");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: 세션 타입 불일치");
        }
        
        User user = (User) userObj;
        Integer userId = user.getId();
        System.out.println("현재 로그인한 유저 ID: " + userId);

        OfficeDTO office = officeService.getOfficeByUserId(userId);

        if (office == null) {
            System.out.println("해당 유저 ID로 등록된 오피스 없음");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("등록된 오피스 정보가 없습니다.");
        }

        return ResponseEntity.ok(office);
    }
}
