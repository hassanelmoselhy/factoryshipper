export function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('ar-EG', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function formatCurrency(amount) {
  return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(amount || 0);
}

// return the raw (percent-encoded) value of a query param, or null if missing
export function getRawQueryParam(name) {
  const href = window.location.href;
  const qIndex = href.indexOf('?');
  if (qIndex === -1) return null;

  // query string without the leading '?', and ignore hash fragment
  const query = href.slice(qIndex + 1).split('#')[0];
  if (!query) return null;

  const parts = query.split('&');
  for (const p of parts) {
    const eq = p.indexOf('=');
    if (eq === -1) continue;
    const key = p.slice(0, eq);
    if (key === name) {
      // return value exactly as in URL, including %XX sequences
      return p.slice(eq + 1);
    }
  }
  return null;
}