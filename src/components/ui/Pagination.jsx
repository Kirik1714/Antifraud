import React, { useMemo } from "react";
import { getPaginationPages } from "../../utils/pagination"; 
import styles from "./Pagination.module.scss";

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalEntries,
  limit,
  setLimit,
}) {
  const totalPages = Math.ceil(totalEntries / limit);
  const skip = (currentPage - 1) * limit;

  const pages = useMemo(() => {
    return getPaginationPages(currentPage, totalPages);
  }, [currentPage, totalPages]);

  if (totalEntries === 0) return null;

  return (
    <div className={styles.tableFooter}>
      <div className={styles.paginationBlock}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`${styles.pageBtn} ${styles.arrowBtn}`}
        >
          ‹
        </button>

        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`dots-${index}`} className={styles.dots}>
                ...
              </span>
            );
          }

          return (
            <button
              key={`page-${page}`}
              onClick={() => setCurrentPage(page)}
              className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ""}`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`${styles.pageBtn} ${styles.arrowBtn}`}
        >
          ›
        </button>
      </div>

      <div className={styles.rightControls}>
        <span className={styles.entriesCounter}>
          Showing {skip + 1} to {Math.min(skip + limit, totalEntries)} of{" "}
          {totalEntries} entries
        </span>

        <div className={styles.pageSizeSelect}>
          <select
            value={limit}
            onChange={(e) => {
              setCurrentPage(1);
              setLimit(Number(e.target.value));
            }}
            aria-label="Select number of entries per page"
          >
            <option value={10}>10 entries per page</option>
            <option value={25}>25 entries per page</option>
            <option value={50}>50 entries per page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
