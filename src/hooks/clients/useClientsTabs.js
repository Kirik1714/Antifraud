import { useState, useEffect } from "react";

//The logic of tabs and UI.
export function useClientsTabs() {
  const [activeTab, setActiveTab] = useState("Clients");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedWidgetClientId, setSelectedWidgetClientId] = useState("1");

  const paginationSkip = (currentPage - 1) * pageSize;

  // Reset page index back to 1 whenever tabs change to prevent blank screens
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Viewport Watcher: Handles responsive layout break-points safely
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    pageSize,
    setPageSize,
    isMobile,
    selectedWidgetClientId,
    setSelectedWidgetClientId,
    paginationSkip,
  };
}