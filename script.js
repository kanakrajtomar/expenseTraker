const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Fetch transactions from server
async function getTransactions() {
  const response = await fetch('http://localhost:1007/api/transactions');
  const transactions = await response.json();
  return transactions;
}

// Display transactions in the UI
function displayTransactions(transactions) {
  list.innerHTML = '';
  transactions.forEach(transaction => {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
      ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction._id})">x</button>
    `;
    list.appendChild(item);
  });
}

// Calculate and display balance, income, and expenses
function updateValues(transactions) {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Add a new transaction
async function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add text and amount');
  } else {
    const transaction = {
      text: text.value,
      amount: +amount.value,
    };

    const response = await fetch('http://localhost:1007/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    const newTransaction = await response.json();

    displayTransactions([newTransaction]);
    updateValues();
    text.value = '';
    amount.value = '';
  }
}

// Initialize the application
async function init() {
  const transactions = await getTransactions();
  displayTransactions(transactions);
  updateValues(transactions);
}

form.addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Call the addTransaction function as before
    addTransaction();
  });
  
// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', init);

