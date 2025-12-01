export function getDateLabel(d) {
  const msgDate = new Date(d);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  function isSameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  if (isSameDay(msgDate, today)) return "Today";
  if (isSameDay(msgDate, yesterday)) return "Yesterday";

  const diff = (today - msgDate) / (1000 * 60 * 60 * 24);
  if (diff < 7) {
    return msgDate.toLocaleDateString(undefined, { weekday: "long" });
  }

  return msgDate.toLocaleDateString();
}
