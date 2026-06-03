var salary   = 0;
var expenses = []; 
var exchangeRates    = {};
var selectedCurrency = 'INR';
var myChart = null;

// ── LOCAL
function saveData() {
  localStorage.setItem('cf_salary',   JSON.stringify(salary));
  localStorage.setItem('cf_expenses', JSON.stringify(expenses));
}

function loadData() {
  var s = localStorage.getItem('cf_salary');
  var e = localStorage.getItem('cf_expenses');
  if (s) salary   = JSON.parse(s);
  if (e) expenses = JSON.parse(e);
}

var ratesLoaded = false;

function fetchRates() {
  var rateInfo = document.getElementById('rateInfo');
  rateInfo.textContent = 'Loading live rates…';

  // Primary: Frankfurter API
  fetch('https://api.frankfurter.app/latest?from=INR&to=USD,EUR,GBP')
    .then(function(response) {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(function(data) {
      if (!data.rates || Object.keys(data.rates).length === 0) {
        throw new Error('Empty rates from API');
      }
      exchangeRates = data.rates;
      ratesLoaded   = true;
        rateInfo.textContent =
        '✅ Live rates (from INR): ' +
        '1 INR = $' + data.rates.USD.toFixed(4) +
        ' | €' + data.rates.EUR.toFixed(4) +
        ' | £' + data.rates.GBP.toFixed(4);
      
      if (selectedCurrency !== 'INR') {
        updateAll();
      }
    })
    .catch(function(error) {
      console.error('Frankfurter API error:', error);
      exchangeRates = { USD: 0.012, EUR: 0.011, GBP: 0.0095 };
      ratesLoaded   = true;
      rateInfo.textContent =
        '⚠️ Live rates unavailable. Using approximate rates ' +
        '($0.012 / €0.011 / £0.0095 per ₹1).';
      if (selectedCurrency !== 'INR') {
        updateAll();
      }
    });
}

// ── CURRENCY CONVERT 
function convertCurrency() {
  var select = document.getElementById('currencySelect');
  selectedCurrency = select.value;

  if (selectedCurrency !== 'INR' && !ratesLoaded) {
    document.getElementById('rateInfo').textContent =
      'Rates still loading, please wait…';
    fetchRates(); // retry
    return;
  }
  updateAll();
}

function convertAmount(inrAmount) {
  if (selectedCurrency === 'INR') return '';
  if (!ratesLoaded) return '(loading…)';
  var rate = exchangeRates[selectedCurrency];
  if (!rate) return '';
  var symbols = { USD: '$', EUR: '€', GBP: '£' };
  var sym = symbols[selectedCurrency] || selectedCurrency;
  return '≈ ' + sym + (inrAmount * rate).toFixed(2);
}

// ── SET SALARY
function setSalary() {
  var input = document.getElementById('salaryInput').value;
  if (input === '' || Number(input) <= 0) {
    showError('Please enter a valid salary.');
    return;
  }
  salary = Number(input);
  document.getElementById('salaryInput').value = '';
  showError('');
  saveData();
  updateAll();
}

// ── ADD EXPENSE 
function addExpense() {
  var name   = document.getElementById('expenseName').value.trim();
  var amount = document.getElementById('expenseAmount').value;

  if (name === '') {
    showError('Please enter an expense name.');
    return;
  }
  if (amount === '' || Number(amount) <= 0) {
    showError('Please enter a valid amount.');
    return;
  }
  if (salary === 0) {
    showError('Please set your salary first!');
    return;
  }

  expenses.push({ id: Date.now(), name: name, amount: Number(amount) });
  document.getElementById('expenseName').value   = '';
  document.getElementById('expenseAmount').value = '';
  showError('');
  saveData();
  updateAll();
}

// ── DELETE EXPENSE 
function deleteExpense(id) {
  expenses = expenses.filter(function(exp) { return exp.id !== id; });
  saveData();
  updateAll();
}

// ── CLEAR ALL
function clearAll() {
  if (!confirm('Clear all data?')) return;
  salary = 0; expenses = [];
  localStorage.removeItem('cf_salary');
  localStorage.removeItem('cf_expenses');
  updateAll();
}

// ── TOTALS 
function getTotalExpenses() {
  var total = 0;
  for (var i = 0; i < expenses.length; i++) {
    total = total + expenses[i].amount;
  }
  return total;
}

// ── UPDATE SUMMARY 
function updateSummary() {
  var totalExpenses = getTotalExpenses();
  var balance       = salary - totalExpenses;

  document.getElementById('showSalary').textContent   = '₹' + salary;
  document.getElementById('showExpenses').textContent = '₹' + totalExpenses;
  document.getElementById('showBalance').textContent  = '₹' + balance;

  document.getElementById('convSalary').textContent   = convertAmount(salary);
  document.getElementById('convExpenses').textContent = convertAmount(totalExpenses);
  document.getElementById('convBalance').textContent  = convertAmount(balance);

  var balanceEl  = document.getElementById('showBalance');
  var warningBox = document.getElementById('warningBox');

  if (salary > 0 && balance < salary * 0.1) {
    balanceEl.classList.add('danger');
    warningBox.style.display = 'block';
  } else {
    balanceEl.classList.remove('danger');
    warningBox.style.display = 'none';
  }
}

// ── RENDER EXPENSE LIST 
function renderExpenseList() {
  var list = document.getElementById('expenseList');

  if (expenses.length === 0) {
    list.innerHTML = '<li>No expenses added yet.</li>';
    return;
  }

  list.innerHTML = '';
  for (var i = 0; i < expenses.length; i++) {
    var exp = expenses[i];
    var li  = document.createElement('li');
    li.innerHTML =
      '<span>' + exp.name + '</span>' +
      '<span>₹' + exp.amount +
        (convertAmount(exp.amount) ? ' <small style="color:#3498db">' + convertAmount(exp.amount) + '</small>' : '') +
      '</span>' +
      '<button class="delete-btn" onclick="deleteExpense(' + exp.id + ')">🗑 Delete</button>';
    list.appendChild(li);
  }
}

// ── RENDER CHART 
function renderChart() {
  var totalExpenses = getTotalExpenses();
  var balance       = salary - totalExpenses;

  // Destroy old chart first to prevent duplication
  if (myChart !== null) {
    myChart.destroy();
  }

  var ctx = document.getElementById('myChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Remaining Balance', 'Total Expenses'],
      datasets: [{
        data: [balance > 0 ? balance : 0, totalExpenses],
        backgroundColor: ['#4CAF50', '#e74c3c']
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

// ── DOWNLOAD PDF 
function downloadPDF() {
  var jsPDF   = window.jspdf.jsPDF;
  var doc     = new jsPDF();
  var today   = new Date().toLocaleDateString('en-IN');
  var totalEx = getTotalExpenses();
  var bal     = salary - totalEx;

  // Title
  doc.setFontSize(18);
  doc.text('Cash-Flow Report', 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text('Date: ' + today, 14, 30);

  // Summary
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text('--- Summary ---', 14, 42);
  doc.text('Total Salary:     Rs. ' + salary,   14, 52);
  doc.text('Total Expenses:   Rs. ' + totalEx,  14, 62);
  doc.text('Remaining Balance: Rs. ' + bal,      14, 72);

  // Warning if needed
  if (salary > 0 && bal < salary * 0.1) {
    doc.setTextColor(200, 0, 0);
    doc.text('WARNING: Balance below 10% of salary!', 14, 82);
    doc.setTextColor(0);
  }

  // Expense list
  doc.setFontSize(12);
  doc.text('--- Expense List ---', 14, 95);

  for (var i = 0; i < expenses.length; i++) {
    var y = 105 + (i * 10);
    doc.setFontSize(11);
    doc.text((i + 1) + '. ' + expenses[i].name + '  —  Rs. ' + expenses[i].amount, 14, y);
  }

  if (expenses.length === 0) {
    doc.text('No expenses added.', 14, 105);
  }

  doc.save('CashFlow-Report-' + today + '.pdf');
}

// ── UPDATE ALL 
function updateAll() {
  updateSummary();
  renderExpenseList();
  renderChart();
}

// ── SHOW ERROR 
function showError(message) {
  document.getElementById('errorMsg').textContent = message;
}

// ── ON PAGE LOAD
loadData();
updateAll();   // render immediately with saved data
fetchRates();  // async: re-renders only if non-INR currency is active
