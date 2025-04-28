package com.kiosk.stock.branch.service;

import com.kiosk.stock.branch.DTO.StockBranchDTO;
import com.kiosk.stock.branch.DTO.StockUpdateRequest;
import com.kiosk.stock.branch.mapper.StockBranchMapper;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class StockBranchService {

    @Autowired
    private StockBranchMapper stockBranchMapper;

    // 재고 감소만 처리하는 메서드
    public void decreaseStock(StockUpdateRequest request) {
    	// 1. 필수 필드 검증
        if (request.getOfficeName() == null || request.getMenuName() == null) {
            throw new IllegalArgumentException("지점명과 메뉴명은 필수입니다");
        }
        
        if (request.getQuantity() <= 0) {
            throw new IllegalArgumentException("수량은 0보다 커야 합니다");
        }

        // 2. 재고 조회
        StockBranchDTO stock = stockBranchMapper.findByOfficeNameAndMenuName(
            request.getOfficeName(), 
            request.getMenuName()
        );
        
        if (stock == null) {
            throw new RuntimeException(
                String.format("재고 정보 없음 - 지점: %s, 메뉴: %s", 
                request.getOfficeName(), request.getMenuName())
            );
        }
        
        // 3. 재고 부족 검사
        if (stock.getQuantity() < request.getQuantity()) {
            throw new RuntimeException(
                String.format("재고 부족 - 현재: %d, 요청: %d",
                stock.getQuantity(), request.getQuantity())
            );
        }
        
        // 4. 재고 업데이트
        stock.setQuantity(stock.getQuantity() - request.getQuantity());
        stockBranchMapper.updateStockBranch(stock);
    }

    // 지점명과 메뉴명으로 재고 조회 메서드 추가
    public StockBranchDTO findByOfficeNameAndMenuName(String officeName, String menuName) {
        return stockBranchMapper.findByOfficeNameAndMenuName(officeName, menuName);
    }

    // 기존 메서드들 유지
    public StockBranchDTO getStockBranchById(int id) {
        return stockBranchMapper.getStockBranchById(id);
    }

    public List<StockBranchDTO> getAllStockBranches() {
        return stockBranchMapper.getAllStockBranches();
    }

    public List<StockBranchDTO> getStockBranchesByOfficeId(int officeId) {
        return stockBranchMapper.getStockBranchesByOfficeId(officeId);
    }

    public List<StockBranchDTO> getStockBranchesByMenuId(int menuId) {
        return stockBranchMapper.getStockBranchesByMenuId(menuId);
    }

    public void updateStockBranch(StockBranchDTO stockBranchDTO) {
        stockBranchMapper.updateStockBranch(stockBranchDTO);
    }

    public void deleteStockBranch(int id) {
        stockBranchMapper.deleteStockBranch(id);
    }
}