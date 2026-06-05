import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetClientsQuery,
  useGetSingleClientQuery,
  useGetDepositTransactionsQuery,
  useGetWithdrawTransactionsQuery,
  useGetLoanTransactionsQuery,
} from "../features/clients/clientsSlice";

const buildBalanceMap = (deposits, loans, withdraws) => {
  const map = {};

  for (let i = 0; i < deposits.length; i++) {
    const tx = deposits[i];
    if (tx.status === "Approved") {
      const cId = tx.clientId;
      map[cId] = (map[cId] || 0) + Number(tx.amount || 0);
    }
  }

  for (let i = 0; i < loans.length; i++) {
    const tx = loans[i];
    if (tx.status === "Approved") {
      const cId = tx.clientId;
      map[cId] = (map[cId] || 0) + Number(tx.amount || 0);
    }
  }

  for (let i = 0; i < withdraws.length; i++) {
    const tx = withdraws[i];
    if (tx.status === "Approved") {
      const cId = tx.clientId;
      map[cId] = (map[cId] || 0) - Number(tx.amount || 0);
    }
  }

  return map;
};

export function useClientsPageData() {
  const [activeTab, setActiveTab] = useState("Clients");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [widgetId, setWidgetId] = useState("1");

  const skip = (currentPage - 1) * limit;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: clientsData, isLoading: isClientsLoading, error: clientsError } = useGetClientsQuery({ limit, skip });
  const users = clientsData?.users || [];
  const totalClientsEntries = clientsData?.total || 0;

  useGetDepositTransactionsQuery();
  useGetWithdrawTransactionsQuery();
  useGetLoanTransactionsQuery();

  const transactionsState = useSelector((state) => state.transactions);
  const allWithdraws = useMemo(() => transactionsState?.withdraws || [], [transactionsState]);
  const allDeposits = useMemo(() => transactionsState?.deposits || [], [transactionsState]);
  const allLoans = useMemo(() => transactionsState?.loans || [], [transactionsState]);

  const { data: singleClient, isFetching: isWidgetLoading } = useGetSingleClientQuery(widgetId, {
    skip: !widgetId || isNaN(Number(widgetId)),
  });

  const balanceMap = useMemo(() => {
    return buildBalanceMap(allDeposits, allLoans, allWithdraws);
  }, [allDeposits, allLoans, allWithdraws]);

  const filteredUsersWithBalance = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return users
      .filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const city = (user.address?.city || "").toLowerCase();
        return fullName.includes(lowerSearch) || city.includes(lowerSearch);
      })
      .map((user) => {
        const startBalance = (user.age || 0) * 1234;
        const txCalculatedBalance = balanceMap[user.id] || 0;
        return {
          ...user,
          balance: startBalance + txCalculatedBalance,
        };
      });
  }, [users, searchTerm, balanceMap]);

  const lowerSearchTerm = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);

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

  const paginatedHistory = useMemo(() => {
    const filtered = combinedHistory.filter(tx => 
      String(tx.id).toLowerCase().includes(lowerSearchTerm) || 
      `user #${tx.clientId}`.toLowerCase().includes(lowerSearchTerm)
    );
    return { items: filtered.slice(skip, skip + limit), total: filtered.length };
  }, [combinedHistory, skip, limit, lowerSearchTerm]);

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

  const widgetBalance = useMemo(() => {
    if (isWidgetLoading) return "Loading...";
    if (!singleClient) return "Not Found";

    const startBalance = (singleClient.age || 0) * 1234;
    const txCalculatedBalance = balanceMap[widgetId] || 0;

    return `$${(startBalance + txCalculatedBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }, [singleClient, isWidgetLoading, balanceMap, widgetId]);

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