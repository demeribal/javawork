package com.kiosk.office.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kiosk.office.DTO.OfficeDTO;
import com.kiosk.office.repository.OfficeMapper;

@Service
public class OfficeService {

    private final OfficeMapper officeMapper;

    public OfficeService(OfficeMapper officeMapper) {
        this.officeMapper = officeMapper;
    }

    public List<OfficeDTO> getAllOffices() {
        return officeMapper.getAllOffices();
    }

    public OfficeDTO getOfficeByUserId(int userId) {
        return officeMapper.findOfficeByUserId(userId);
    }
}
