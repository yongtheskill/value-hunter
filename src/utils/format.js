const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatMoney = (amount, withPlus) => {
  const addPlus = !!withPlus;
  return `${amount < 0 ? '-' : addPlus ? '+' : ''}$${numberWithCommas(
    Math.abs(Math.round(amount * 100) / 100).toFixed(2)
  )}`;
};

const twodp = (amount) => {
  return (Math.round(amount * 100) / 100).toFixed(2);
};

const priceHistoryToGraphData = (history, currentPeriod) => {
  const priceHistories = [];
  for (const periodN in history) {
    if (periodN > currentPeriod) continue;
    priceHistories.push({ x: periodN, y: history[periodN] });
  }
  priceHistories.sort((a, b) => a.x - b.x);
  return priceHistories;
};

export { numberWithCommas, formatMoney, priceHistoryToGraphData, twodp };
