import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux"; 
import { 
  useGetClientsQuery, 
  useGetSingleClientQuery,
  useGetDepositTransactionsQuery,      
  useGetWithdrawTransactionsQuery,     
  useGetLoanTransactionsQuery          
} from "../clientsSlice";
import { Search } from "lucide-react";

import TopNavigation from "../components/TopNavigation";
import styles from "./ClientsPage.module.scss";

import ClientsTable from "../components/tables/ClientsTable";
import DepositTable from "../components/tables/DepositTable";
import WithdrawTable from "../components/tables/WithdrawTable";
import LoansTable from "../components/tables/LoansTable";
import HistoryTable from "../components/tables/HistoryTable";
import Pagination from "../../../components/ui/Pagination";

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState("Clients");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  
  const [limit, setLimit] = useState(10);
  const skip = (currentPage - 1) * limit;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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



  const [widgetId, setWidgetId] = useState("1"); 
  const { data: singleClient, isFetching: isWidgetLoading } = useGetSingleClientQuery(widgetId, {
    skip: !widgetId || isNaN(Number(widgetId)),
  });

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address?.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const paginateData = (dataArray) => {
    if (!dataArray) return { items: [], total: 0 };
    
    const filtered = dataArray.filter(tx => 
      String(tx.id).toLowerCase().includes(searchTerm.toLowerCase()) || 
      `user #${tx.clientId}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const slicedItems = filtered.slice(skip, skip + limit);
    return { items: slicedItems, total: filtered.length };
  };

  const paginatedDeposits = useMemo(() => paginateData(allDeposits), [allDeposits, skip, limit, searchTerm]);
  const paginatedWithdraws = useMemo(() => paginateData(allWithdraws), [allWithdraws, skip, limit, searchTerm]);
  const paginatedLoans = useMemo(() => paginateData(allLoans), [allLoans, skip, limit, searchTerm]);

  const paginatedHistory = useMemo(() => {
    const combined = [
      ...allDeposits.map(t => ({ ...t, operationType: 'Deposit' })),
      ...allWithdraws.map(t => ({ ...t, operationType: 'Withdraw' })),
      ...allLoans.map(t => ({ ...t, operationType: 'Loan' }))
    ];
    return paginateData(combined);
  }, [allDeposits, allWithdraws, allLoans, skip, limit, searchTerm]);

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

    const targetId = widgetId; 
    const startBalance = (singleClient.age || 0) * 1234;

    const totalApprovedDeps = allDeposits
      .filter((tx) => tx.clientId == targetId && tx.status === "Approved")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const totalApprovedLoans = allLoans
      .filter((tx) => tx.clientId == targetId && tx.status === "Approved")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const totalApprovedWiths = allWithdraws
      .filter((tx) => tx.clientId == targetId && tx.status === "Approved")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const finalBalance = startBalance + totalApprovedDeps + totalApprovedLoans - totalApprovedWiths;

  

    return `$${finalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }, [singleClient, isWidgetLoading, allDeposits, allWithdraws, allLoans, widgetId]);


  

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (isClientsLoading) return <div className={styles.centered}>Loading database...</div>;
  if (clientsError) return <div className={styles.centeredError}>Error loading data.</div>;
  const renderActiveTable = () => {
    if (isMobile && activeTab === "Clients") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 16px", marginTop: "16px" }}>
          {filteredUsers.map((user, idx) => {
            const startBalance = (user.age || 0) * 1234;
            const totalApprovedDeps = allDeposits.filter(tx => tx.clientId == user.id && tx.status === "Approved").reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
            const totalApprovedLoans = allLoans.filter(tx => tx.clientId == user.id && tx.status === "Approved").reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
            const totalApprovedWiths = allWithdraws.filter(tx => tx.clientId == user.id && tx.status === "Approved").reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
            const userFinalBalance = startBalance + totalApprovedDeps + totalApprovedLoans - totalApprovedWiths;

            return (
              <div key={user.id || idx} style={{
                background: "#ffffff",
                padding: "16px",
                borderRadius: "6px",
                border: "1px solid #e9ecef",
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "600", color: "#212529", fontSize: "15px" }}>{user.firstName} {user.lastName}</span>
                  <span style={{ fontWeight: "600", color: "#137333" }}>
                    ${userFinalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#666666", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span><b>CID:</b> {user.id || idx + 1}</span>
                  <span><b>Location:</b> {user.address?.city}, {user.address?.state} • {user.address?.address}</span>
                  <span><b>Phone:</b> {user.phone || "+81 965-431-3024"}</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    switch (activeTab) {
      case "Clients":
        return <ClientsTable filteredUsers={filteredUsers} deposits={allDeposits} withdraws={allWithdraws} loans={allLoans} />;
      case "Deposit":
        return <DepositTable transactions={paginatedDeposits.items} />;
      case "Withdraw":
        return <WithdrawTable transactions={paginatedWithdraws.items} />;
      case "Loans":
        return <LoansTable transactions={paginatedLoans.items} />;
      case "Transaction History":
        return <HistoryTable transactions={paginatedHistory.items} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.layoutWrapper}>
   
      <div className={styles.contentArea}>
        <TopNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <h1 className={styles.pageTitle}>Customer Profile</h1>
        <div className={styles.mainWorkspace}>
          
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className={styles.balanceContainer}>
              <div className={styles.balanceTitle}>View Customer Account Balance</div>
              <div className={styles.balanceLine}></div>
              <div className={styles.balanceViewer}>
                <span className={styles.label}>Acc ID</span>
                <input type="text" value={widgetId} onChange={(e) => setWidgetId(e.target.value)} className={styles.smallInput} placeholder="ID" />
                <span className={styles.label}>Acc Balance</span>
                <input type="text" readOnly value={widgetBalance} className={styles.balanceInput} style={{ color: singleClient ? "#137333" : "#eb5757" }} />
              </div>
            </div>

            <div className={styles.actionGrid}>
              <button className={styles.btnBlue}>Edit Info</button>
              <button className={styles.btnOutline}>Add Customer</button>
              <button className={styles.btnOutline}>Add Account</button>
            </div>
          </div>

          {renderActiveTable()}

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            limit={limit}
            setLimit={setLimit}
            totalEntries={currentTotalEntries} 
          />
        </div>
      </div>
    </div>
  );
}