import React from "react";
// Импортируем LoaderIcon вместе с Search из нашего единого файла иконок
import { Search, LoaderIcon } from "../../../components/ui/Icons"; 

import TopNavigation from "../components/TopNavigation";
import MobileClientsCards from "../components/tables/MobileClientsCards";
import ClientsTable from "../components/tables/ClientsTable";
import DepositTable from "../components/tables/DepositTable";
import WithdrawTable from "../components/tables/WithdrawTable";
import LoansTable from "../components/tables/LoansTable";
import HistoryTable from "../components/tables/HistoryTable";
import Pagination from "../../../components/ui/Pagination";
import styles from "./ClientsPage.module.scss";
import { useClientsPageData } from "../../../hooks/clients/useClientsPageData";
import { getSearchPlaceholder } from "../../../utils/clientsUtils";

export default function ClientsPage() {
  const data = useClientsPageData();

  // Идеальный центрированный лоадер с фирменной крутящейся иконкой
  if (data.isClientsLoading) {
    return (
      <div className={styles.centered}>
        <LoaderIcon size={64} className={`${styles.iconOrange} ${styles.spinnerRotate}`} />
        <p className={styles.loadingText}>Syncing customer profile records...</p>
      </div>
    );
  }

  if (data.clientsError) return <div className={styles.centeredError}>Error loading data.</div>;

  const renderActiveTable = () => {
    if (data.isMobile && data.activeTab === "Clients") {
      return <MobileClientsCards filteredUsers={data.filteredUsers} />;
    }

    switch (data.activeTab) {
      case "Clients":
        return <ClientsTable filteredUsers={data.filteredUsers} />;
      case "Deposit":
        return <DepositTable transactions={data.paginatedDeposits.items} />;
      case "Withdraw":
        return <WithdrawTable transactions={data.paginatedWithdraws.items} />;
      case "Loans":
        return <LoansTable transactions={data.paginatedLoans.items} />;
      case "Transaction History":
        return <HistoryTable transactions={data.paginatedHistory.items} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.contentArea}>
        <TopNavigation activeTab={data.activeTab} setActiveTab={data.setActiveTab} />
        <h1 className={styles.pageTitle}>Customer Profile</h1>
        <div className={styles.mainWorkspace}>
          
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input type="text" placeholder={getSearchPlaceholder(data.activeTab)} value={data.searchTerm} onChange={(e) => data.setSearchTerm(e.target.value)} />
            </div>

            <div className={styles.balanceContainer}>
              <div className={styles.balanceTitle}>View Customer Account Balance</div>
              <div className={styles.balanceLine}></div>
              <div className={styles.balanceViewer}>
                <span className={styles.label}>Acc ID</span>
                <input type="text" value={data.widgetId} onChange={(e) => data.setWidgetId(e.target.value)} className={styles.smallInput} placeholder="ID" />
                <span className={styles.label}>Acc Balance</span>
                <input type="text" readOnly value={data.widgetBalance} className={`${styles.balanceInput} ${data.singleClient ? styles.amountDeposit : styles.amountWithdraw}`} aria-label="Customer Account Balance"/>
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
            currentPage={data.currentPage}
            setCurrentPage={data.setCurrentPage}
            limit={data.limit}
            setLimit={data.setLimit}
            totalEntries={data.currentTotalEntries} 
          />
        </div>
      </div>
    </div>
  );
}