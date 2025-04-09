package com.kiosk.login.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.kiosk.login.entity.User;

@Mapper
public interface Loginmapper {

	@Select("SELECT username, password, is_head AS isHead FROM users WHERE username = #{username}")
	User findByUsername(String username);

}
