package com.kiosk.menu.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kiosk.menu.model.Menu;
import com.kiosk.menu.model.MenuDTO;
import com.kiosk.menu.service.MenuService;

@RestController
@RequestMapping("api/menus")
@CrossOrigin("http://192.168.0.35:5500/")

public class MenuController {
	
	//	http://localhost:8080/api/menus
	
	@Autowired
	MenuService menuService;
	
    // [1] 전체 메뉴 조회
    @GetMapping
    public List<MenuDTO> getAllMenus() {
        return menuService.getAllMenus();
    }

    // [2] 메뉴 등록
    @PostMapping
    public void createMenu(@RequestBody MenuDTO menudto) {
        menuService.createMenu(menudto);
    }

    // [3] 메뉴 수정
    @PutMapping("/{id}")
    public int updateMenu(@PathVariable int id, @RequestBody MenuDTO menudto) {
        return menuService.updateMenu(id, menudto);
    }

    // [4] 메뉴 삭제
    @DeleteMapping("/{id}")
    public int deleteMenu(@PathVariable int id) {
        return menuService.deleteMenu(id);
    }
}