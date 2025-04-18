package com.kiosk.stock.branch.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kiosk.stock.branch.DTO.StockBranchDTO;
import com.kiosk.stock.branch.service.StockBranchService;

@RestController
@RequestMapping("/api/stock/branch")
public class StockBranchController {

    @Autowired
    private StockBranchService stockBranchService;

    @GetMapping("/{id}")
    public ResponseEntity<StockBranchDTO> getStockBranchById(@PathVariable("id") int id) {
        StockBranchDTO stockBranch = stockBranchService.getStockBranchById(id);
        return stockBranch != null
                ? new ResponseEntity<>(stockBranch, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping
    public ResponseEntity<List<StockBranchDTO>> getAllStockBranches() {
        List<StockBranchDTO> stockBranches = stockBranchService.getAllStockBranches();
        return new ResponseEntity<>(stockBranches, HttpStatus.OK);
    }

    @GetMapping("/office/{officeId}")
    public ResponseEntity<List<StockBranchDTO>> getStockBranchesByOfficeId(@PathVariable int officeId) {
        List<StockBranchDTO> stockBranches = stockBranchService.getStockBranchesByOfficeId(officeId);
        return new ResponseEntity<>(stockBranches, HttpStatus.OK);
    }

    @GetMapping("/menu/{menuId}")
    public ResponseEntity<List<StockBranchDTO>> getStockBranchesByMenuId(@PathVariable int menuId) {
        List<StockBranchDTO> stockBranches = stockBranchService.getStockBranchesByMenuId(menuId);
        return new ResponseEntity<>(stockBranches, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Void> addStockBranch(@RequestBody StockBranchDTO stockBranchDTO) {
        stockBranchService.addStockBranch(stockBranchDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateStockBranch(@PathVariable int id, @RequestBody StockBranchDTO stockBranchDTO) {
        stockBranchDTO.setId(id);
        stockBranchService.updateStockBranch(stockBranchDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStockBranch(@PathVariable int id) {
        stockBranchService.deleteStockBranch(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
