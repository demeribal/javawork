package com.kiosk.office.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kiosk.office.DTO.OfficeDTO;

@Mapper
public interface OfficeMapper {
	List<OfficeDTO> getAllOffices();
	OfficeDTO findOfficeByUserId(int userId);
}
