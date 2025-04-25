package com.kiosk.stock.header.mapper;

import com.kiosk.stock.header.DTO.StockHeaderDTO;
import com.kiosk.stock.header.model.StockHeader;
import com.kiosk.stock.header.model.StockHeaderDAO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface StockHeaderMapper {
    // 발주 생성 (생성된 ID 반환)
    int insertStockHeader(StockHeader stockHeader);
    
    StockHeaderDTO getStockHeaderById(@Param("id") int id);
    
    List<StockHeaderDTO> getAllStockHeaders();
    
    Integer findStockIdByNames(
            @Param("officeName") String officeName,
            @Param("menuName") String menuName
        );
    
    // 상태 업데이트
    void updateStockHeader(StockHeaderDAO stockHeaderDAO);
    
    // 일괄 상태 업데이트 추가
    void updateBulkOrderStatus(List<Map<String, Object>> updates);
    
    void deleteStockHeader(@Param("id") int id);
    
    // 발주 상태별 조회 추가
    List<StockHeaderDTO> getStockHeadersByStatus(@Param("status") String status);
    
    // 지점별 발주 조회 추가
    List<StockHeaderDTO> getStockHeadersByOfficeName(@Param("officeName") String officeName);

}