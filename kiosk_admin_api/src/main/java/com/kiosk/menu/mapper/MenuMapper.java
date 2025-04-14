package com.kiosk.menu.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kiosk.menu.model.Menu;
import com.kiosk.menu.model.MenuDTO;

@Mapper
public interface MenuMapper {
	
	void insert(Menu menu);

	List<Menu> selectAll();

	int update(Menu menu);

	int delete(int id);	
}
