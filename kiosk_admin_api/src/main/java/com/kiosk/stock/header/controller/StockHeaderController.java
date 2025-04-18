package com.kiosk.stock.header.controller;

import com.kiosk.stock.header.DTO.StockHeaderDTO;
import com.kiosk.stock.header.service.StockHeaderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock/header")
public class StockHeaderController {

    @Autowired
    private StockHeaderService stockHeaderService;

    @GetMapping("/{id}")
    public ResponseEntity<StockHeaderDTO> getStockHeaderById(@PathVariable("id") int id) {
        StockHeaderDTO stockHeader = stockHeaderService.getStockHeaderById(id);
        return stockHeader != null
                ? new ResponseEntity<>(stockHeader, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping
    public ResponseEntity<List<StockHeaderDTO>> getAllStockHeaders() {
        List<StockHeaderDTO> stockHeaders = stockHeaderService.getAllStockHeaders();
        return new ResponseEntity<>(stockHeaders, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Void> addStockHeader(@RequestBody StockHeaderDTO stockHeaderDTO) {
        stockHeaderService.addStockHeader(stockHeaderDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateStockHeader(@PathVariable int id, @RequestBody StockHeaderDTO stockHeaderDTO) {
        stockHeaderDTO.setId(id);
        stockHeaderService.updateStockHeader(stockHeaderDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStockHeader(@PathVariable int id) {
        stockHeaderService.deleteStockHeader(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
