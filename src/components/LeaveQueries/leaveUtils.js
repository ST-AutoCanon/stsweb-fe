export const parseLocalDate = (dateStr) => {
  if (!dateStr) return "";
  if (typeof dateStr === "string" && dateStr.length === 10) return dateStr;
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

export const parseDateOnly = (isoDate) => {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (!isNaN(d.getTime())) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  const parts = String(isoDate).split("-");
  if (parts.length >= 3) {
    const [y, m, day] = parts;
    return new Date(Number(y), Number(m) - 1, Number(day));
  }
  return null;
};

export const calculateDays = (startDate, endDate, h_f_day = "") => {
  const s = parseDateOnly(startDate);
  const e = parseDateOnly(endDate);
  if (!s || !e || e < s) return 0;
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((e - s) / msPerDay);
  const total = diffDays >= 0 ? diffDays + 1 : 0;
  if (
    String(h_f_day).toLowerCase().includes("half") &&
    s.getTime() === e.getTime()
  ) {
    return 0.5;
  }
  return total;
};

export const computeRequestedDays = (start, end, h_f_day) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  if (h_f_day === "Half Day") return 0.5;
  return diff;
};

export const getAdvanceNoticeDays = (setting) =>
  Number(setting?.advance_notice_days ?? setting?.advanceNoticeDays ?? 0);
