package com.kiosk.stock.service;

import com.kiosk.stock.mapper.StockMapper;
import com.kiosk.stock.model.Stock;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StockService {
    
    @Autowired
    private StockMapper stockMapper;
    
    public Stock getStockById(int id) {
        return stockMapper.getStockById(id);
    }
    
    public List<Stock> getAllStocks() {
        return stockMapper.getAllStocks();
    }
    
    public List<Stock> getStocksByOfficeId(int officeId) {
        return stockMapper.getStocksByOfficeId(officeId);
    }
    
    public List<Stock> getStocksByMenuId(int menuId) {
        return stockMapper.getStocksByMenuId(menuId);
    }
    
    public void addStock(Stock stock) {
        stockMapper.insertStock(stock);
    }
    
    public void updateStock(Stock stock) {
        stockMapper.updateStock(stock);
    }
    
    public void deleteStock(int id) {
        stockMapper.deleteStock(id);
    }
}
