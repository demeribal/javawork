package com.kiosk.login.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.kiosk.login.entity.User;

@Mapper
public interface LoginMapper {

    User findByUsername(String username);

    List<User> findAll();

}
