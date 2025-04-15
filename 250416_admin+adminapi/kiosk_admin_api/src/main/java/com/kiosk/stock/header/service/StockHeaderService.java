package com.kiosk.stock.header.service;

import com.kiosk.stock.header.DTO.StockHeaderDTO;
import com.kiosk.stock.header.mapper.StockHeaderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StockHeaderService {

	@Autowired
    private StockHeaderMapper stockHeaderMapper;

    public StockHeaderDTO getStockHeaderById(int id) {
        return stockHeaderMapper.getStockHeaderById(id);
    }

    public List<StockHeaderDTO> getAllStockHeaders() {
        return stockHeaderMapper.getAllStockHeaders();
    }

    public void addStockHeader(StockHeaderDTO stockHeaderDTO) {
        stockHeaderMapper.insertStockHeader(stockHeaderDTO);
    }

    public void updateStockHeader(StockHeaderDTO stockHeaderDTO) {
        stockHeaderMapper.updateStockHeader(stockHeaderDTO);
    }

    public void deleteStockHeader(int id) {
        stockHeaderMapper.deleteStockHeader(id);
    }
}