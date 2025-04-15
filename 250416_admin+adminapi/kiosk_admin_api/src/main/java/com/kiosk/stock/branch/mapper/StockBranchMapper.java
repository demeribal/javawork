package com.kiosk.stock.branch.mapper;

import com.kiosk.stock.branch.DTO.StockBranchDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StockBranchMapper {
	StockBranchDTO getStockBranchById(int id);
    List<StockBranchDTO> getAllStockBranches();
    List<StockBranchDTO> getStockBranchesByOfficeId(int officeId);  // Add
    List<StockBranchDTO> getStockBranchesByMenuId(int menuId);      // Add
    void insertStockBranch(StockBranchDTO stockBranchDTO);
    void updateStockBranch(StockBranchDTO stockBranchDTO);
    void deleteStockBranch(int id);
}
