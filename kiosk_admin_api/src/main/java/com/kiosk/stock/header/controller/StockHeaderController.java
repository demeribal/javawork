package com.kiosk.stock.header.controller;

import com.kiosk.stock.header.DTO.StockHeaderDTO;
import com.kiosk.stock.header.model.StockHeader;
import com.kiosk.stock.header.model.StockHeaderDAO;
import com.kiosk.stock.header.service.StockHeaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @PostMapping
    public ResponseEntity<Void> addStockHeader(@RequestBody StockHeader stockHeader) {
    	stockHeader.setLastUpdate(LocalDateTime.now());
        stockHeaderService.addStockHeader(stockHeader);
        return new ResponseEntity<>(HttpStatus.CREATED);
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
