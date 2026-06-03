export const formatTxDate = (dateString) => {
  if (!dateString) return "11/5/2022 3:12 PST";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 

    return `${month}/${day}/${year} ${hours}:${minutes} ${ampm} PST`;
  } catch (e) {
    return "11/5/2022 3:12 PST";
  }
};