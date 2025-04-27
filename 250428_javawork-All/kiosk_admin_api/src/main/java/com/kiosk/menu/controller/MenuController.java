package com.kiosk.menu.controller;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // ✅ 이걸로 수정해야 함!
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kiosk.menu.model.Menu;
import com.kiosk.menu.model.MenuDAO;
import com.kiosk.menu.model.MenuDTO;
import com.kiosk.menu.model.UploadResponse;
import com.kiosk.menu.service.MenuService;


@RestController
@RequestMapping("/api/menus")


public class MenuController {
	
	//	http://localhost:8080/api/menus
	
	@Autowired
	MenuService menuService;
	
    // [1] 전체 메뉴 조회
    @GetMapping
    public List<Menu> getAllMenus() {
    	System.out.println(menuService.getAllMenus());
        return menuService.getAllMenus();
    }
    
    // [1] 전체 메뉴 조회 (본사 메뉴 조회)
    @GetMapping("/dto")
    public List<MenuDTO> getAllMenusdto() {
        List<MenuDTO> getmenus = menuService.getAllMenusdto();
        System.out.println(getmenus);
        return menuService.getAllMenusdto();
    }

    // [1] 이름으로 메뉴 조회
    @GetMapping("/{menuName}")
    public Menu getMenuByName(@PathVariable String menuName) {
    	return menuService.getMenuByName(menuName);
    }

	 // [2] 메뉴 등록
    @PostMapping
    public ResponseEntity<?> createMenu(
        @RequestParam("menuName") String menuName,
        @RequestParam("menuCode") String menuCode,
        @RequestParam(value = "isUse", defaultValue = "true") boolean isUse,
        @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {

        MenuDAO menuDAO = MenuDAO.builder()
            .menuName(menuName)
            .menuCode(menuCode)
            .imagePath("/images/default.png") // 기본 경로 먼저 세팅
            .build();

        // 이미지 처리
        if (image != null && !image.isEmpty()) {
        	String imageName = image.getOriginalFilename();
        	
        	if (imageName == null || !isImageFile(imageName)) {
        		Map<String, String> errorResponse = new HashMap<>();
        		errorResponse.put("status", "error");
        		errorResponse.put("message", "이미지 파일만 업로드 가능합니다.");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }

            String extension = FilenameUtils.getExtension(image.getOriginalFilename());
            String safeFileName = menuName.replaceAll("[^a-zA-Z0-9가-힣]", "_") + "." + extension;
            Path savePath = Paths.get("src/main/resources/static/images", safeFileName);
            
            Files.copy(image.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
            menuDAO.setImagePath("/images/" + safeFileName);
        }

        // 메뉴 등록 후 ID 반환
        int menuId = menuService.createMenuAndReturnId(menuDAO); // 이 메서드는 createMenu + id 반환해야 함

        // 판매 상태는 별도로 등록 (또는 DB에서 default 값이 true면 생략 가능)
        //menuService.updateMenuStatus(menuId, isUse);

        Map<String, String> response = new HashMap<>();
        response.put("message", "메뉴 등록 완료");
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)  // ✅ 추가
                .body(response);
    }
    
    private boolean isImageFile(String fileName) {
        String[] imageExtensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"};
        String fileExtension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
        for (String ext : imageExtensions) {
            if (fileExtension.equals(ext)) {
                return true;
            }
        }
        return false;
    }

    // [3] 메뉴 수정
    @PutMapping("/{id}")
    public int updateMenu(@PathVariable int id, @RequestBody MenuDAO menudao) {
        return menuService.updateMenu(id, menudao);
    }

    // [4] 메뉴 삭제
    //@DeleteMapping("/{id}")
    //public int deleteMenu(@PathVariable int id) {
    //    return menuService.deleteMenu(id);
    //}
    // [5] 메뉴 판매상태(isUse)만 수정
    @PatchMapping("/{id}/isUse")
    public ResponseEntity<Map<String, String>> updateIsUse(@PathVariable int id, @RequestBody Map<String, Boolean> payload) {
        Boolean isUse = payload.get("isUse");
        menuService.updateIsUse(id, isUse);

        // 응답 메시지 생성
        Map<String, String> response = new HashMap<>();
        response.put("message", "isUse updated successfully");

        // HTTP 200 상태 코드와 함께 JSON 반환
        return ResponseEntity.ok(response);
    }
 // [6] 이미지 업로드
    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // [1] 업로드 실제 경로 가져오기
            String realPath = new File(uploadDir).getAbsolutePath();
            System.out.println("📁 파일 업로드 경로: " + realPath);

            // ✅ [2] 파일명 안전하게 정제 (한글/특수문자 제거 → "_" 대체)
            String safeFileName = UUID.randomUUID().toString() + "_" +
                file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

            // [3] 저장 경로 조합
            Path filePath = Paths.get(realPath, safeFileName);

            // [4] 디렉토리 없으면 생성
            Files.createDirectories(filePath.getParent());

            // [5] 파일 저장
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // [6] 프론트에 전달할 이미지 경로
            String imagePath = "/images/" + safeFileName;

            return ResponseEntity.ok(new UploadResponse(imagePath));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    
}