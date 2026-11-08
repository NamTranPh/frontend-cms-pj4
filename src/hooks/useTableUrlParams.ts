import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UseTableUrlParamsOptions {
  defaultPage?: number;
  defaultLimit?: number;
  debounceMs?: number;
}

export function useTableUrlParams(options: UseTableUrlParamsOptions = {}) {
  const { defaultPage = 1, defaultLimit = 10, debounceMs = 400 } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc các giá trị phân trang và tìm kiếm hiện tại từ URL
  const page = useMemo(() => {
    const p = parseInt(searchParams.get('page') || '', 10);
    return isNaN(p) || p < 1 ? defaultPage : p;
  }, [searchParams, defaultPage]);

  const limit = useMemo(() => {
    const l = parseInt(searchParams.get('limit') || '', 10);
    return isNaN(l) || l < 1 ? defaultLimit : l;
  }, [searchParams, defaultLimit]);

  const urlSearch = searchParams.get('search') || '';

  // State cục bộ cho input tìm kiếm để người dùng gõ mượt mà không bị khựng
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);

  // Điều chỉnh state khi search param từ URL thay đổi (React Recommended Pattern)
  if (prevUrlSearch !== urlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  // Debounce đẩy từ khóa tìm kiếm lên URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== urlSearch) {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            if (searchInput.trim()) {
              next.set('search', searchInput.trim());
            } else {
              next.delete('search');
            }
            // Reset về trang 1 khi tìm kiếm thay đổi
            next.set('page', '1');
            return next;
          },
          { replace: true },
        );
      }
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, urlSearch, setSearchParams, debounceMs]);

  // Chuyển trang
  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (newPage <= 1) {
          next.delete('page');
        } else {
          next.set('page', String(newPage));
        }
        return next;
      });
    },
    [setSearchParams],
  );

  // Đổi số lượng bản ghi mỗi trang
  const setLimit = useCallback(
    (newLimit: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('limit', String(newLimit));
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams],
  );

  // Cập nhật giá trị bộ lọc tùy chỉnh (ví dụ: status, role)
  const setParam = useCallback(
    (key: string, value: string | undefined | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== 'ALL') {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams],
  );

  // Lấy giá trị của một param tùy ý
  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key) || '';
    },
    [searchParams],
  );

  // Xóa trắng toàn bộ bộ lọc
  const resetFilters = useCallback(() => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    page,
    limit,
    search: searchInput,
    debouncedSearch: urlSearch,
    setSearch: setSearchInput,
    setPage,
    setLimit,
    setParam,
    getParam,
    resetFilters,
  };
}
