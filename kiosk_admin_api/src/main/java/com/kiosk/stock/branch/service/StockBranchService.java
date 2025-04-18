package com.kiosk.stock.branch.service;

import com.kiosk.stock.branch.mapper.StockBranchMapper;
import com.kiosk.stock.branch.DTO.StockBranchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StockBranchService {

    @Autowired
    private StockBranchMapper stockBranchMapper;

    public StockBranchDTO getStockBranchById(int id) {
        return stockBranchMapper.getStockBranchById(id);
    }

    public List<StockBranchDTO> getAllStockBranches() {
        return stockBranchMapper.getAllStockBranches();
    }

    public List<StockBranchDTO> getStockBranchesByOfficeId(int officeId) { // Add
        return stockBranchMapper.getStockBranchesByOfficeId(officeId);
    }

    public List<StockBranchDTO> getStockBranchesByMenuId(int menuId) {     // Add
        return stockBranchMapper.getStockBranchesByMenuId(menuId);
    }

    public void addStockBranch(StockBranchDTO stockBranchDTO) {
        stockBranchMapper.insertStockBranch(stockBranchDTO);
    }

    public void updateStockBranch(StockBranchDTO stockBranchDTO) {
        stockBranchMapper.updateStockBranch(stockBranchDTO);
    }

    public void deleteStockBranch(int id) {
        stockBranchMapper.deleteStockBranch(id);
    }
}
