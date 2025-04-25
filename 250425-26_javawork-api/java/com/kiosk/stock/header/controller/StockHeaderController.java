package com.kiosk.stock.header.controller;

import com.kiosk.stock.header.DTO.StockHeaderDTO;
import com.kiosk.stock.header.model.StockHeader;
import com.kiosk.stock.header.model.StockHeaderDAO;
import com.kiosk.stock.header.service.StockHeaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock/header")
public class StockHeaderController {

    @Autowired
    private StockHeaderService stockHeaderService;

 // 발주 생성 API 개선
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody StockHeaderDTO orderDTO) {
        try {
            orderDTO.setStatus("발주요청"); // 상태 기본값 설정
            StockHeaderDTO savedOrder = stockHeaderService.createOrder(orderDTO);
            
            // 성공 응답 (명시적 JSON 반환)
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                    "success", true,
                    "data", savedOrder,
                    "message", "발주 생성 성공"
                ));
        } catch (Exception e) {
            // 실패 응답 (상세 오류 메시지 포함)
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                    "success", false,
                    "error", e.getMessage(),
                    "message", "발주 생성 실패"
                ));
        }
    }


    // 발주 상태 일괄 업데이트 API 추가
    @PutMapping("/bulk-status")
    public ResponseEntity<Void> updateBulkOrderStatus(@RequestBody List<Map<String, Object>> updates) {
        try {
            stockHeaderService.updateBulkOrderStatus(updates);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StockHeaderDTO> getStockHeaderById(@PathVariable("id") int id) {
        StockHeaderDTO stockHeaderDTO = stockHeaderService.getStockHeaderById(id);
        return stockHeaderDTO != null
                ? new ResponseEntity<>(stockHeaderDTO, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping
    public ResponseEntity<List<StockHeaderDTO>> getAllStockHeaders() {
        List<StockHeaderDTO> stockHeaderDTO = stockHeaderService.getAllStockHeaders();
        return new ResponseEntity<>(stockHeaderDTO, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateStockHeader(@PathVariable int id, @RequestBody Map<String, String> body) {
    	String status = body.get("status");
    	System.out.println(status);

    	StockHeaderDAO stockHeaderDAO = new StockHeaderDAO();
    	stockHeaderDAO.setId(id);
    	stockHeaderDAO.setStatus(status);
    	stockHeaderDAO.setLastUpdate(LocalDateTime.now());
        stockHeaderService.updateStockHeader(stockHeaderDAO);
        
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStockHeader(@PathVariable int id) {
        stockHeaderService.deleteStockHeader(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
