PLAYS = {
  hamlet: { name: 'Hamlet', type: 'tragedy' },
  'as-like': { name: 'As You Like It', type: 'comedy' },
  othello: { name: 'Othello', type: 'tragedy' },
};

INVOICES = [
  {
    customer: 'BigCo',
    performances: [
      { playId: 'hamlet', audience: '55' },
      { playId: 'as-like', audience: '35' },
      { playId: 'othello', audience: '40' },
    ],
  },
];

function playFor(aPerformance) {
  return PLAYS[aPerformance.playId];
}

function amountFor(aPerformance) {
  let result = 0;
  switch (playFor(aPerformance).type) {
    case 'tragedy':
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
    default:
      break;
  }
  return result;
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);
  if (playFor(aPerformance).type === 'comedy') {
    result += Math.floor(aPerformance.audience / 5);
  }
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function totalAmount(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result = amountFor(perf);
  }
  return result;
}

function totalVolumeCredits(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result = volumeCreditsFor(perf);
  }
  return result;
}

function statement(invoice) {
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(totalAmount(invoice))}\n`;
  result += `You earned ${totalVolumeCredits(invoice)} credits \n`;
  return result;
}

console.log(statement(INVOICES[0], PLAYS));
