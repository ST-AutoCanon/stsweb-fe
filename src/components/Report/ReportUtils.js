// utils.js
export function getApiBase() {
  return (
    process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || ""
  );
}
