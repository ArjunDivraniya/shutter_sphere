export const getMonthMeta = (baseDate) => {
  const firstDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const lastDay = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

  const cells = [];
  for (let i = 0; i < firstDay.getDay(); i += 1) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d += 1) {
    cells.push(new Date(baseDate.getFullYear(), baseDate.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return {
    cells,
    monthLabel: baseDate.toLocaleString("en-US", { month: "long", year: "numeric" }),
  };
};

export const formatMoney = (value) => `$${Number(value || 0).toLocaleString("en-US")}`;
