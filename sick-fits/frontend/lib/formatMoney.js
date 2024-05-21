export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: process.env.NEXT_PUBLIC_CURRENCY,
    minimumFractionDigits: 2,
  };

  // check if its a clean dollar amount
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat(process.env.NEXT_PUBLIC_LOCALE, options);

  return formatter.format(amount / 100);
}
