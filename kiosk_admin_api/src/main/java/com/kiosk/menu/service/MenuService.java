package com.kiosk.menu.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kiosk.menu.mapper.MenuMapper;
import com.kiosk.menu.model.Menu;
import com.kiosk.menu.model.MenuDTO;

@Service
public class MenuService {
	
	@Autowired
	MenuMapper mapper;

	public void createMenu(MenuDTO menudto) {
		Menu menu = new Menu();
		BeanUtils.copyProperties(menudto, menu);
		mapper.insert(menu);
	}

	public List<MenuDTO> getAllMenus() {
	       return mapper.selectAll().stream()
	                .map(menu -> {
	                    MenuDTO menudto = new MenuDTO();
	                    BeanUtils.copyProperties(menu, menudto);
	                    return menudto;
	                })
	                .collect(Collectors.toList());
	    }
	
	public int updateMenu(int id, MenuDTO menudto) {
        Menu menu = new Menu();
        BeanUtils.copyProperties(menudto, menu);
        menu.setId(id);
        return mapper.update(menu);
    }
	
	public int deleteMenu(int id) {
	        return mapper.delete(id);
	}
}
