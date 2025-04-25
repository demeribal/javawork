package com.kiosk.stock.branch.controller;

import com.kiosk.stock.branch.DTO.StockBranchDTO;
import com.kiosk.stock.branch.DTO.StockUpdateRequest;
import com.kiosk.stock.branch.service.StockBranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock/branch")
public class StockBranchController {

    @Autowired
    private StockBranchService stockBranchService;
    
    // 재고 업데이트 API 추가
    @PostMapping("/update")
    public ResponseEntity<?> updateStock(@RequestBody StockUpdateRequest request) {
        try {
            stockBranchService.decreaseStock(request);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "재고 업데이트 성공"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "유효성 검사 실패",
                "message", e.getMessage()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "재고 처리 실패",
                "message", e.getMessage()
            ));
        }
    }


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
