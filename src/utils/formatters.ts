/**
 * Format số tiền sang định dạng tiền tệ Việt Nam: ví dụ 300.000 đ/giờ
 */
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 đ/giờ';
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted} đ/giờ`;
};

/**
 * Format số tiền tổng: ví dụ 600.000 đ
 */
export const formatTotalCurrency = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 đ';
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted} đ`;
};

/**
 * Format khung giờ: ví dụ "17h00 - 19h00"
 */
export const formatTimeRange = (startHour: number, hours: number): string => {
  const end = startHour + hours;

  const formatHM = (val: number) => {
    const h = Math.floor(val);
    const m = Math.round((val - h) * 60);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(h)}:${pad(m)}`;
  };

  const durationStr =
    hours === 1.5
      ? '1h30p'
      : hours % 1 === 0.5
      ? `${Math.floor(hours)}h30p`
      : `${hours} giờ`;

  return `${formatHM(startHour)} - ${formatHM(end)} (${durationStr})`;
};
