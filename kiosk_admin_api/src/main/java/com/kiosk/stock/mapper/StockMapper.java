package com.kiosk.stock.mapper;

import com.kiosk.stock.model.Stock;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StockMapper {
    Stock getStockById(int id);
    List<Stock> getAllStocks();
    List<Stock> getStocksByOfficeId(int officeId);
    List<Stock> getStocksByMenuId(int menuId);
    void insertStock(Stock stock);
    void updateStock(Stock stock);
    void deleteStock(int id);
}
