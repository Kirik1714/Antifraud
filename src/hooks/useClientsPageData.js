import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetClientsQuery,
  useGetSingleClientQuery,
  useGetDepositTransactionsQuery,
  useGetWithdrawTransactionsQuery,
  useGetLoanTransactionsQuery,
} from "../features/clients/clientsSlice";

/**
 * Pure utility function to compute a real-time balance ledger for all clients.
 * Aggregates only 'Approved' transactions to compute absolute financial positions.
 */
const buildBalanceMap = (deposits, loans, withdraws) => {
  const map = {};

  // Process Deposits: Increases client's available balance
  for (let i = 0; i < deposits.length; i++) {
    const tx = deposits[i];
    if (tx.status === "Approved") {
      const cId = tx.clientId;
      map[cId] = (map[cId] || 0) + Number(tx.amount || 0);
    }
  }

  // Process Loans: Injected capital, temporarily treated as positive balance increment
  for (let i = 0; i < loans.length; i++) {
    const tx = loans[i];
    if (tx.status === "Approved") {
      const cId = tx.clientId;
      map[cId] = (map[cId] || 0) + Number(tx.amount || 0);
    }
  }

  // Process Withdrawals: Decreases client's balance pool
  for (let i = 0; i < withdraws.length; i++) {
    const tx = withdraws[i];
    if (tx.status === "Approved") {
      const cId = tx.clientId;
      map[cId] = (map[cId] || 0) - Number(tx.amount || 0);
    }
  }

  return map;
};

/**
 * Custom React Hook orchestrating the data layer for the Clients Dashboard.
 * Implements Container/Presenter separation by encapsulating state, API requests, 
 * pagination, and multi-tier filtering logic away from presentational components.
 */
export function useClientsPageData() {
  // --- UI States & Controls ---
  const [activeTab, setActiveTab] = useState("Clients");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [widgetId, setWidgetId] = useState("1"); // Track active client ID in the side detail view

  // Pagination pointer calculation for RTK Query & local array slicing
  const skip = (currentPage - 1) * limit;

  // Sync: Reset page indexes back to 1 whenever tabs change to prevent blank states
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Viewport Watcher: Handles responsive layout break-points efficiently
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Memory leak protection
  }, []);

  // --- Core API Queries (RTK Query Layer) ---
  // Primary paginated request to pull clients directory records
  const { data: clientsData, isLoading: isClientsLoading, error: clientsError } = useGetClientsQuery({ limit, skip });
  const users = clientsData?.users || [];
  const totalClientsEntries = clientsData?.total || 0;

  // Trigger cache-hydration queries for transaction categories
  useGetDepositTransactionsQuery();
  useGetWithdrawTransactionsQuery();
  useGetLoanTransactionsQuery();

  // --- Global Client-State Synchronizer (Redux Selector Layer) ---
  const transactionsState = useSelector((state) => state.transactions);
  const allWithdraws = useMemo(() => transactionsState?.withdraws || [], [transactionsState]);
  const allDeposits = useMemo(() => transactionsState?.deposits || [], [transactionsState]);
  const allLoans = useMemo(() => transactionsState?.loans || [], [transactionsState]);

  // Context-specific Single Client profile request for the analytical Side-Widget
  const { data: singleClient, isFetching: isWidgetLoading } = useGetSingleClientQuery(widgetId, {
    skip: !widgetId || isNaN(Number(widgetId)), // Skip invocation if ID is blank or invalid
  });

  // --- Derived Financial Calculations (Memoized Data Processing) ---
  // Compute global balance map object only when core transaction logs mutate
  const balanceMap = useMemo(() => {
    return buildBalanceMap(allDeposits, allLoans, allWithdraws);
  }, [allDeposits, allLoans, allWithdraws]);

  // Filter global users base and dynamically calculate simulated financial profiles at runtime
  const filteredUsersWithBalance = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return users
      .filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const city = (user.address?.city || "").toLowerCase();
        return fullName.includes(lowerSearch) || city.includes(lowerSearch);
      })
      .map((user) => {
        const startBalance = (user.age || 0) * 1234; // Deterministic pseudo-random seed balance using client age
        const txCalculatedBalance = balanceMap[user.id] || 0;
        return {
          ...user,
          balance: startBalance + txCalculatedBalance,
        };
      });
  }, [users, searchTerm, balanceMap]);

  // Cache normalized lower-case search term to save execution cycles inside slice operations
  const lowerSearchTerm = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);

  // --- Independent Tab Slicing & Pagination Processors ---
  const paginatedDeposits = useMemo(() => {
    const filtered = allDeposits.filter(tx => 
      String(tx.id).toLowerCase().includes(lowerSearchTerm) || 
      `user #${tx.clientId}`.toLowerCase().includes(lowerSearchTerm)
    );
    return { items: filtered.slice(skip, skip + limit), total: filtered.length };
  }, [allDeposits, skip, limit, lowerSearchTerm]);

  const paginatedWithdraws = useMemo(() => {
    const filtered = allWithdraws.filter(tx => 
      String(tx.id).toLowerCase().includes(lowerSearchTerm) || 
      `user #${tx.clientId}`.toLowerCase().includes(lowerSearchTerm)
    );
    return { items: filtered.slice(skip, skip + limit), total: filtered.length };
  }, [allWithdraws, skip, limit, lowerSearchTerm]);

  const paginatedLoans = useMemo(() => {
    const filtered = allLoans.filter(tx => 
      String(tx.id).toLowerCase().includes(lowerSearchTerm) || 
      `user #${tx.clientId}`.toLowerCase().includes(lowerSearchTerm)
    );
    return { items: filtered.slice(skip, skip + limit), total: filtered.length };
  }, [allLoans, skip, limit, lowerSearchTerm]);

  // Aggregated Audit Ledger: Combines all discrete stream records into a singular event stream
  const combinedHistory = useMemo(() => {
    const combined = [];
    for (let i = 0; i < allDeposits.length; i++) {
      combined.push({ ...allDeposits[i], operationType: 'Deposit' });
    }
    for (let i = 0; i < allWithdraws.length; i++) {
      combined.push({ ...allWithdraws[i], operationType: 'Withdraw' });
    }
    for (let i = 0; i < allLoans.length; i++) {
      combined.push({ ...allLoans[i], operationType: 'Loan' });
    }
    return combined;
  }, [allDeposits, allWithdraws, allLoans]);

  // Paginated Global Transaction History segment wrapper
  const paginatedHistory = useMemo(() => {
    const filtered = combinedHistory.filter(tx => 
      String(tx.id).toLowerCase().includes(lowerSearchTerm) || 
      `user #${tx.clientId}`.toLowerCase().includes(lowerSearchTerm)
    );
    return { items: filtered.slice(skip, skip + limit), total: filtered.length };
  }, [combinedHistory, skip, limit, lowerSearchTerm]);

  // Evaluates and provides total record bounds for pagination render modules based on layout views
  const currentTotalEntries = useMemo(() => {
    switch (activeTab) {
      case "Clients": return totalClientsEntries;
      case "Deposit": return paginatedDeposits.total;
      case "Withdraw": return paginatedWithdraws.total;
      case "Loans": return paginatedLoans.total;
      case "Transaction History": return paginatedHistory.total;
      default: return 0;
    }
  }, [activeTab, totalClientsEntries, paginatedDeposits.total, paginatedWithdraws.total, paginatedLoans.total, paginatedHistory.total]);

  // Computes precise real-time statement values for the focused Side-Widget layout profile
  const widgetBalance = useMemo(() => {
    if (isWidgetLoading) return "Loading...";
    if (!singleClient) return "Not Found";

    const startBalance = (singleClient.age || 0) * 1234;
    const txCalculatedBalance = balanceMap[widgetId] || 0;

    // Standardized currency format projection output matching international banking configurations ($XX,XXX.XX)
    return `$${(startBalance + txCalculatedBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }, [singleClient, isWidgetLoading, balanceMap, widgetId]);

  // Expose clean presentational primitives back to UI consumer
  return {
    activeTab, setActiveTab,
    currentPage, setCurrentPage,
    searchTerm, setSearchTerm,
    limit, setLimit,
    isMobile, widgetId, setWidgetId,
    filteredUsers: filteredUsersWithBalance,
    allDeposits, allWithdraws, allLoans,
    paginatedDeposits, paginatedWithdraws, paginatedLoans, paginatedHistory,
    currentTotalEntries, widgetBalance, singleClient,
    isClientsLoading, clientsError
  };
}