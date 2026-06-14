import { useMemo } from "react";
import { useClientsTabs } from "./useClientsTabs";
import { useClientTransactions } from "./useClientTransactions";
import { useClientsTableData } from "./useClientsTableData";
// Facade
export function useClientsPageData() {
  const tabs = useClientsTabs();
 
  const transactions = useClientTransactions(tabs.searchTerm, tabs.paginationSkip, tabs.pageSize);
  
  const clients = useClientsTableData(
    tabs.pageSize,
    tabs.paginationSkip,
    tabs.searchTerm,
    transactions.balanceMap,
    tabs.selectedWidgetClientId
  );

  // Synchronously compute total metrics layout bounds to update our pagination module counters
  const currentTotalEntries = useMemo(() => {
    switch (tabs.activeTab) {
      case "Clients": return clients.totalClientsEntries;
      case "Deposit": return transactions.paginatedDeposits.total;
      case "Withdraw": return transactions.paginatedWithdraws.total;
      case "Loans": return transactions.paginatedLoans.total;
      case "Transaction History": return transactions.paginatedHistory.total;
      default: return 0;
    }
  }, [tabs.activeTab, clients.totalClientsEntries, transactions.paginatedDeposits.total, transactions.paginatedWithdraws.total, transactions.paginatedLoans.total, transactions.paginatedHistory.total]);

  // Present precise primitives back to the main UI Page nodes safely
  return {
    activeTab: tabs.activeTab,
    setActiveTab: tabs.setActiveTab,
    currentPage: tabs.currentPage,
    setCurrentPage: tabs.setCurrentPage,
    searchTerm: tabs.searchTerm,
    setSearchTerm: tabs.setSearchTerm,
    limit: tabs.pageSize,
    setLimit: tabs.setPageSize,
    isMobile: tabs.isMobile,
    widgetId: tabs.selectedWidgetClientId,
    setWidgetId: tabs.setSelectedWidgetClientId,
    filteredUsers: clients.filteredClients,
    paginatedDeposits: transactions.paginatedDeposits,
    paginatedWithdraws: transactions.paginatedWithdraws,
    paginatedLoans: transactions.paginatedLoans,
    paginatedHistory: transactions.paginatedHistory,
    currentTotalEntries,
    widgetBalance: clients.widgetBalanceText,
    singleClient: clients.widgetClient,
    isClientsLoading: clients.isClientsLoading,
    clientsError: clients.clientsError,
  };
}