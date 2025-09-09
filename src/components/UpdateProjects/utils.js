export const getStatusBgColor = (status) => {
  switch (status) {
    case "Active":
      return "#d1ecf1";
    case "Pending":
      return "#fff3cd";
    case "Completed":
      return "#d4edda";
    default:
      return "transparent";
  }
};

export const getFinanceStatusColor = (status) => {
  switch (status) {
    case "not Initiated":
      return "#d1ecf1";
    case "Pending":
      return "#fff3cd";
    case "Received":
      return "#d4edda";
    default:
      return "#f7f7f7";
  }
};

export const formatDate = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toISOString().split("T")[0];
};
