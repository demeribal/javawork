package com.kiosk.stock.controller;

import com.kiosk.stock.model.Stock;
import com.kiosk.stock.service.StockService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stocks")
public class StockController {
    
    @Autowired
    private StockService stockService;
    
    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable("id") int id) {
        Stock stock = stockService.getStockById(id);
        if (stock != null) {
            return new ResponseEntity<>(stock, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks() {
        List<Stock> stocks = stockService.getAllStocks();
        return new ResponseEntity<>(stocks, HttpStatus.OK);
    }
    
    @GetMapping("/office/{officeId}")
    public ResponseEntity<List<Stock>> getStocksByOfficeId(@PathVariable("officeId") int officeId) {
        List<Stock> stocks = stockService.getStocksByOfficeId(officeId);
        return new ResponseEntity<>(stocks, HttpStatus.OK);
    }
    
    @GetMapping("/menu/{menuId}")
    public ResponseEntity<List<Stock>> getStocksByMenuId(@PathVariable("menuId") int menuId) {
        List<Stock> stocks = stockService.getStocksByMenuId(menuId);
        return new ResponseEntity<>(stocks, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<Void> addStock(@RequestBody Stock stock) {
        stockService.addStock(stock);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateStock(@PathVariable("id") int id, @RequestBody Stock stock) {
        stock.setId(id);
        stockService.updateStock(stock);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable("id") int id) {
        stockService.deleteStock(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
