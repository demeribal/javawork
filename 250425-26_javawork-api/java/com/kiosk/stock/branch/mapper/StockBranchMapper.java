package com.kiosk.stock.branch.mapper;

import com.kiosk.stock.branch.DTO.StockBranchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StockBranchMapper {
    StockBranchDTO getStockBranchById(@Param("id") int id);
    List<StockBranchDTO> getAllStockBranches();
    List<StockBranchDTO> getStockBranchesByOfficeId(@Param("officeId") int officeId);
    List<StockBranchDTO> getStockBranchesByMenuId(@Param("menuId") int menuId);
    StockBranchDTO findByOfficeNameAndMenuName(
        @Param("officeName") String officeName, 
        @Param("menuName") String menuName
        );
    void updateStockBranch(StockBranchDTO stockBranchDTO);
    void updateStockQuantity(
        @Param("officeName") String officeName,
        @Param("menuName") String menuName,
        @Param("quantity") int quantity);
    void deleteStockBranch(@Param("id") int id);
}