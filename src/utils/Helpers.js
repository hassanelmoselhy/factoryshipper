export function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('ar-EG', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function formatCurrency(amount) {
  return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(amount || 0);
}