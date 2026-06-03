export const getStableScore = (id, status) => {
  if (!id) return 150;
  
  const salt = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  if (status === "Fraud") {
    return 700 + (salt % 299); 
  } 
  
  if (status === "High Risk") {
    return 200 + (salt % 499); 
  }

  return 100 + (salt % 99); 
};