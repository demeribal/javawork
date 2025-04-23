package com.kiosk.menu.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kiosk.menu.mapper.MenuMapper;
import com.kiosk.menu.model.Menu;
import com.kiosk.menu.model.MenuDAO;
import com.kiosk.menu.model.MenuDTO;

@Service
public class MenuService {
	
	@Autowired
	MenuMapper mapper;

	public void createMenu(MenuDAO menudao) {
		mapper.insert(menudao);
	}

	public List<Menu> getAllMenus() {
       return mapper.selectAll();
    }
	
	public List<MenuDTO> getAllMenusdto() {
		return mapper.selectAlldto();
	}
	
	public Menu getMenuByName(String menuName) {
		return mapper.selectOneByName(menuName);
	}
	
	public int updateMenu(int id, MenuDAO menudao) {
		Menu menu = Menu.builder()
						.id(id)
						.menuName(menudao.getMenuName())
						.menuCode(menudao.getMenuCode())
						.imagePath(menudao.getImagePath())
						.build();
        return mapper.update(menu);
    }
	
	//public int deleteMenu(int id) {
	//        return mapper.delete(id);
	//}

	public void updateIsUse(int id, Boolean isUse) {
	    System.out.println("🔥 [Service] isUse 상태 변경 요청 - id: " + id + ", isUse: " + isUse);
	    mapper.updateIsUse(id, isUse);
	}

	// ID 리턴 등록 메서드
	public int createMenuAndReturnId(MenuDAO menudao) {
	    return mapper.insertMenuAndReturnId(menudao);
	}

	// 등록 + 상태 설정 통합
	public int createMenuAndSetStatus(MenuDAO menudao, boolean isUse) {
	    int menuId = mapper.insertMenuAndReturnId(menudao);
	    mapper.updateIsUse(menuId, isUse);
	    return menuId;
	}
}
