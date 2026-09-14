/**
 * Formatting & privacy-masking helpers for the RouteShare Admin Console.
 * Rule: never expose full phone numbers or addresses; always mask license plates.
 */

export const formatVND = (n) => `${new Intl.NumberFormat('vi-VN').format(n ?? 0)} ₫`;

export const formatNumber = (n) => new Intl.NumberFormat('vi-VN').format(n ?? 0);

export const formatDateTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const day = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${time} · ${day}`;
};

// "51G-119.02" -> "51G-•••.02" — keeps province/series prefix + last segment, hides the rest.
export const maskPlate = (plate) => {
  if (!plate) return '—';
  const clean = plate.trim();
  if (clean.length <= 6) return clean;
  const head = clean.slice(0, 3);
  const tail = clean.slice(-3);
  return `${head}•••${tail}`;
};

// "0908 123 456" -> "0908 •• 456" — used only where an operator-relay contact hint is needed.
export const maskPhone = (phone) => {
  if (!phone) return '—';
  const digits = phone.replace(/\s+/g, '');
  if (digits.length < 7) return '••• •••';
  return `${digits.slice(0, 4)} •• ${digits.slice(-3)}`;
};
