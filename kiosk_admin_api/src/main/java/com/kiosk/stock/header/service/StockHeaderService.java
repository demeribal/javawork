package com.kiosk.stock.header.service;

import com.kiosk.stock.header.DTO.StockHeaderDTO;
import com.kiosk.stock.header.mapper.StockHeaderMapper;
import com.kiosk.stock.header.model.StockHeader;
import com.kiosk.stock.header.model.StockHeaderDAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StockHeaderService {

	@Autowired
    private StockHeaderMapper stockHeaderMapper;

    public void addStockHeader(StockHeader stockHeader) {
        stockHeaderMapper.insertStockHeader(stockHeader);
    }
	
    public StockHeaderDTO getStockHeaderById(int id) {
        return stockHeaderMapper.getStockHeaderById(id);
    }

    public List<StockHeaderDTO> getAllStockHeaders() {
        return stockHeaderMapper.getAllStockHeaders();
    }

    public void updateStockHeader(StockHeaderDAO stockHeaderDAO) {
        stockHeaderMapper.updateStockHeader(stockHeaderDAO);
    }

    public void deleteStockHeader(int id) {
        stockHeaderMapper.deleteStockHeader(id);
    }
}