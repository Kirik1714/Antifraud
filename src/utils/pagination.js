export const getPaginationPages = (currentPage, totalPages) => {
  const pages = [];
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      if (pages.length > 0 && i - pages[pages.length - 1] > 1) {
        pages.push('...');
      }
      pages.push(i);
    }
  }
  
  return pages;
};