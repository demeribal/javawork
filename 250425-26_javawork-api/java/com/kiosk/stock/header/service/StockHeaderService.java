package com.kiosk.stock.header.service;

import com.kiosk.stock.header.DTO.StockHeaderDTO;
import com.kiosk.stock.header.mapper.StockHeaderMapper;
import com.kiosk.stock.header.model.StockHeader;
import com.kiosk.stock.header.model.StockHeaderDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class StockHeaderService {

    @Autowired
    private StockHeaderMapper stockHeaderMapper;

    // 발주 생성 메서드 개선 (DTO 반환)
    public StockHeaderDTO createOrder(StockHeaderDTO orderDTO) {
        StockHeader stockHeader = new StockHeader();
        stockHeader.setOfficeName(orderDTO.getOfficeName());
        stockHeader.setMenuName(orderDTO.getMenuName());
        stockHeader.setQuantity(orderDTO.getQuantity());
        stockHeader.setStatus("발주요청");
        stockHeader.setLastUpdate(LocalDateTime.now());
        
        stockHeaderMapper.insertStockHeader(stockHeader);
        return stockHeaderMapper.getStockHeaderById(stockHeader.getId());
    }

    // 일괄 상태 업데이트 메서드 추가
    public void updateBulkOrderStatus(List<Map<String, Object>> updates) {
        for (Map<String, Object> update : updates) {
            StockHeaderDAO dao = new StockHeaderDAO();
            dao.setId((Integer) update.get("id"));
            dao.setStatus((String) update.get("status"));
            dao.setLastUpdate(LocalDateTime.now());
            stockHeaderMapper.updateStockHeader(dao);
        }
    }

    // 기존 메서드들 유지
    public void addStockHeader(StockHeader stockHeader) {
        stockHeaderMapper.insertStockHeader(stockHeader);
    }
    
    public Optional<StockHeaderDAO> findById(int id) {
        return Optional.ofNullable(stockHeaderMapper.getStockHeaderById(id))
                      .map(dto -> {
                          StockHeaderDAO dao = new StockHeaderDAO();
                          dao.setId(dto.getId());
                          dao.setStatus(dto.getStatus());
                          return dao;
                      });
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