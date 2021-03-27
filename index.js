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

function amountFor(perf, play) {
  let thisAmount = 0;

  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
    default:
      break;
  }

  return thisAmount;
}

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playId];
    let thisAmount = amountFor(perf, play);

    //add credits per volume
    volumeCredits += Math.max(perf.audience - 30, 0);

    //sum of extra credit for each ten spectators of commedy
    if (play.type === 'comedy') volumeCredits += Math.floor(perf.audience / 5);

    //shows the result line for this requisition
    result += `${play.name}: ${format(thisAmount / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += thisAmount;
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;

  return result;
}

console.log(statement(INVOICES[0], PLAYS));
