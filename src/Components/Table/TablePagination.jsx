import React, { useCallback } from "react";
import { Box, Typography, Button, Select, MenuItem, useTheme } from "@mui/material";
import { useSearchParams } from "react-router-dom";

/**
 * TablePagination Component
 * Enhanced pagination with page numbers, first/last buttons, and URL integration
 * Uses 1-based indexing to match backend API
 */
function TablePagination({ 
  paginationData, 
  theme,
  isSmallScreen,
  colors,
  paginatedDataLength,
  totalRecords
}) {
  const themeHook = useTheme();
  const activeTheme = theme || themeHook;
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read from URL params (source of truth) - these update automatically when URL changes
  const currentPage = Number.parseInt(searchParams.get("page")) || 1;
  const pageSize = Number.parseInt(searchParams.get("pageSize")) || 10;
  
  // Get total from paginationData or fallback
  const total = paginationData?.total ?? totalRecords ?? 0;
  
  // Calculate total pages - prioritize backend value, otherwise calculate from total/pageSize
  // Backend may return limit instead of pageSize
  const backendPageSize = paginationData?.pageSize || paginationData?.limit || pageSize;
  const totalPages = paginationData?.totalPages ?? (total > 0 ? Math.ceil(total / backendPageSize) : 1);
  
  // Handle page change (1-based)
  const handlePageChange = useCallback((newPage) => {
    // Clamp to valid bounds
    const targetPage = Math.max(1, Math.min(newPage, totalPages));
    
    const params = new URLSearchParams(searchParams);
    params.set("page", String(targetPage));
    // Ensure pageSize is preserved
    if (!params.has("pageSize")) {
      params.set("pageSize", String(pageSize));
    }
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams, pageSize, totalPages]);
  
  // Handle rows per page change
  const handleRowsPerPageChange = useCallback((e) => {
    const newPageSize = Number(e.target.value);
    
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", String(newPageSize));
    params.set("page", "1"); // Reset to first page when changing page size
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);
  
  // Don't render on small screens
  if (isSmallScreen) {
    return null;
  }
  
  // Calculate visible page numbers (show 5 pages around current)
  const getVisiblePages = () => {
    if (totalPages <= 1) return [1];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    // Adjust start if we're near the end
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  
  const visiblePages = getVisiblePages();
  // Calculate hasPrev/hasNext from current state, with fallback to paginationData
  const hasPrev = paginationData?.hasPrev ?? (currentPage > 1);
  const hasNext = paginationData?.hasNext ?? (currentPage < totalPages && totalPages > 1);
  
  const themeColors = colors || {
    primary: activeTheme.palette.primary.main,
    text: {
      primary: activeTheme.palette.text.primary,
      secondary: activeTheme.palette.text.secondary,
    },
    surface: activeTheme.palette.background.paper,
  };
  
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        mt: 2,
        borderTop: `1px solid ${activeTheme.palette.divider}`,
        background: themeColors.surface,
        borderRadius: 1,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {/* Records Info */}
      <Typography variant="body2" sx={{ color: themeColors.text.secondary }}>
        Showing {paginatedDataLength || 0} of {total} records
      </Typography>
      
      {/* Rows Per Page */}
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ color: themeColors.text.secondary }}>
          Rows per page:
        </Typography>
        <Select
          size="small"
          value={pageSize}
          onChange={handleRowsPerPageChange}
          sx={{ 
            width: 80,
            backgroundColor: themeColors.surface,
          }}
        >
          {[10, 25, 50, 100]
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .concat(pageSize)
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .sort((a, b) => a - b)
            .map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
        </Select>
      </Box>
      
      {/* Page Info */}
      <Typography variant="body2" sx={{ color: themeColors.text.primary, fontWeight: 500 }}>
        Page <b>{currentPage}</b> of <b>{totalPages}</b>
      </Typography>
      
      {/* Navigation */}
      <Box display="flex" alignItems="center" gap={1}>
        {/* First Page */}
        <Button
          variant="outlined"
          size="small"
          disabled={!hasPrev || currentPage === 1}
          onClick={() => handlePageChange(1)}
          title="First page"
          sx={{
            minWidth: 36,
            color: themeColors.text.primary,
          }}
        >
          ⏮
        </Button>
        
        {/* Previous */}
        <Button
          variant="outlined"
          size="small"
          disabled={!hasPrev}
          onClick={() => handlePageChange(currentPage - 1)}
          title="Previous page"
          sx={{
            minWidth: 36,
            color: themeColors.text.primary,
          }}
        >
          ◀
        </Button>
        
        {/* Page Numbers */}
        {totalPages > 1 && (
          <Box display="flex" alignItems="center" gap={0.5}>
            {visiblePages.map((pageNum) => (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "contained" : "outlined"}
                size="small"
                onClick={() => handlePageChange(pageNum)}
                sx={{ 
                  minWidth: 36,
                  ...(currentPage === pageNum && {
                    backgroundColor: themeColors.primary,
                    color: activeTheme.palette.mode === 'dark' ? 'black' : 'white',
                    '&:hover': {
                      backgroundColor: activeTheme.palette.mode === 'dark'
                        ? activeTheme.palette.primary.light
                        : activeTheme.palette.primary.dark,
                    },
                  }),
                }}
              >
                {pageNum}
              </Button>
            ))}
          </Box>
        )}
        
        {/* Next */}
        <Button
          variant="outlined"
          size="small"
          disabled={!hasNext}
          onClick={() => handlePageChange(currentPage + 1)}
          title="Next page"
          sx={{
            minWidth: 36,
            color: themeColors.text.primary,
          }}
        >
          ▶
        </Button>
        
        {/* Last Page */}
        <Button
          variant="outlined"
          size="small"
          disabled={!hasNext || currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
          title="Last page"
          sx={{
            minWidth: 36,
            color: themeColors.text.primary,
          }}
        >
          ⏭
        </Button>
      </Box>
    </Box>
  );
}

export default TablePagination;

