var salary   = 0;
var expenses = [];
var myChart = null;

// ── LOCALSTORAGE: Save 
function saveData() {
  localStorage.setItem('cf_salary',   JSON.stringify(salary));
  localStorage.setItem('cf_expenses', JSON.stringify(expenses));
}

// ── LOCALSTORAGE: Load on page open 
function loadData() {
  var savedSalary   = localStorage.getItem('cf_salary');
  var savedExpenses = localStorage.getItem('cf_expenses');

  if (savedSalary)   salary   = JSON.parse(savedSalary);
  if (savedExpenses) expenses = JSON.parse(savedExpenses);
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

  expenses.push({
    id:     Date.now(),
    name:   name,
    amount: Number(amount)
  });

  document.getElementById('expenseName').value   = '';
  document.getElementById('expenseAmount').value = '';
  showError('');
  saveData();
  updateAll();
}

// ── DELETE EXPENSE 
function deleteExpense(id) {
  expenses = expenses.filter(function(exp) {
    return exp.id !== id;
  });
  saveData();
  updateAll();
}

// ── CLEAR ALL DATA 
function clearAll() {
  if (!confirm('Are you sure you want to clear all data?')) return;
  salary   = 0;
  expenses = [];
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

  var balanceEl    = document.getElementById('showBalance');
  var warningBox   = document.getElementById('warningBox');

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
      '<span>₹' + exp.amount + '</span>' +
      '<button class="delete-btn" onclick="deleteExpense(' + exp.id + ')">🗑 Delete</button>';
    list.appendChild(li);
  }
}

// ── RENDER CHART 
function renderChart() {
  var totalExpenses = getTotalExpenses();
  var balance       = salary - totalExpenses;

  if (myChart !== null) {
    myChart.destroy();
  }

  var ctx = document.getElementById('myChart').getContext('2d');

  myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Remaining Balance', 'Total Expenses'],
      datasets: [{
        data: [
          balance > 0 ? balance : 0,
          totalExpenses
        ],
        backgroundColor: ['#4CAF50', '#e74c3c']
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// ── RUN EVERYTHING 
function updateAll() {
  updateSummary();
  renderExpenseList();
  renderChart();
}

// ── SHOW ERROR 
function showError(message) {
  document.getElementById('errorMsg').textContent = message;
}

loadData();
updateAll();
