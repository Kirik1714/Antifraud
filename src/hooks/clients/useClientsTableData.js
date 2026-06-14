import { useMemo } from "react";
import { useGetClientsQuery, useGetSingleClientQuery } from "../../features/clients/clientsSlice";

//The logic of the client list.
export function useClientsTableData(pageSize, paginationSkip, searchTerm, balanceMap, widgetClientId) {
  // Primary paginated request to pull clients directory records
  const { data: clientsData, isLoading: isClientsLoading, error: clientsError } = useGetClientsQuery({ 
    limit: pageSize, 
    skip: paginationSkip 
  });
  
  const rawUsers = clientsData?.users || [];
  const totalClientsEntries = clientsData?.total || 0;

  // Single Client profile request for the side analytics widget
  const { data: widgetClient, isFetching: isWidgetLoading } = useGetSingleClientQuery(widgetClientId, {
    skip: !widgetClientId || isNaN(Number(widgetClientId)),
  });

  // Filter global users base and calculate financial profiles
  const filteredClientsWithBalances = useMemo(() => {
    const cleanSearch = searchTerm.toLowerCase();
    
    return rawUsers
      .filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const city = (user.address?.city || "").toLowerCase();
        return fullName.includes(cleanSearch) || city.includes(cleanSearch);
      })
      .map((user) => {
        const startingSeedBalance = (user.age || 0) * 1234;
        const liveBalanceChanges = balanceMap[user.id] || 0;
        return {
          ...user,
          balance: startingSeedBalance + liveBalanceChanges,
        };
      });
  }, [rawUsers, searchTerm, balanceMap]);

  // Compute precise financial statement text for the focused side widget
  const widgetBalanceText = useMemo(() => {
    if (isWidgetLoading) return "Loading...";
    if (!widgetClient) return "Not Found";

    const startingSeedBalance = (widgetClient.age || 0) * 1234;
    const liveBalanceChanges = balanceMap[widgetClientId] || 0;
    const finalCalculatedBalance = startingSeedBalance + liveBalanceChanges;

    return `$${finalCalculatedBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }, [widgetClient, isWidgetLoading, balanceMap, widgetClientId]);

  return {
    filteredClients: filteredClientsWithBalances,
    totalClientsEntries,
    widgetClient,
    widgetBalanceText,
    isClientsLoading,
    clientsError,
  };
}