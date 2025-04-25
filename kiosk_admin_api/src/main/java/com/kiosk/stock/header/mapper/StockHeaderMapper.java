package com.kiosk.stock.header.mapper;

import com.kiosk.stock.header.DTO.StockHeaderDTO;
import com.kiosk.stock.header.model.StockHeader;
import com.kiosk.stock.header.model.StockHeaderDAO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StockHeaderMapper {
    void insertStockHeader(StockHeader stockHeader);
    StockHeaderDTO getStockHeaderById(@Param("id") int id);
    List<StockHeaderDTO> getAllStockHeaders();
    void updateStockHeader(StockHeaderDAO stockHeaderDAO);
    void deleteStockHeader(@Param("id") int id);
}
