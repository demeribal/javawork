package com.kiosk.menu.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.kiosk.menu.model.Menu;
import com.kiosk.menu.model.MenuDAO;
import com.kiosk.menu.model.MenuDTO;

@Mapper
public interface MenuMapper {
	
	void insert(MenuDAO menudao);

	List<Menu> selectAll();
	
	List<MenuDTO> selectAlldto();	
	
	Menu selectOneByName(String menuName);

	int update(Menu menu);

	int delete(int id);

	void updateIsUse(@Param("id") int id, @Param("isUse") Boolean isUse);

	int insertMenuAndReturnId(MenuDAO menudao);
	

}
