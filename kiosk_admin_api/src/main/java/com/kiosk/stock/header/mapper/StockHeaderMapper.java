package com.kiosk.stock.header.mapper;

import com.kiosk.stock.header.DTO.StockHeaderDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StockHeaderMapper {
    StockHeaderDTO getStockHeaderById(@Param("id") int id);
    List<StockHeaderDTO> getAllStockHeaders();
    void insertStockHeader(StockHeaderDTO stockHeaderDTO);
    void updateStockHeader(StockHeaderDTO stockHeaderDTO);
    void deleteStockHeader(@Param("id") int id);
}
