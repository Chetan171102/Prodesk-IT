// ── STATE 
var salary = 0;
var expenses = [];

// ── SET SALARY 
function setSalary() {
  var input = document.getElementById('salaryInput').value;

  
  if (input === '' || Number(input) <= 0) {
    showError('Please enter a valid salary amount.');
    return;
  }

  salary = Number(input);
  document.getElementById('salaryInput').value = '';
  showError('');
  updateSummary();
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
    showError('Please enter a valid expense amount.');
    return;
  }
  if (salary === 0) {
    showError('Please set your salary first!');
    return;
  }

  expenses.push({ name: name, amount: Number(amount) });

  document.getElementById('expenseName').value   = '';
  document.getElementById('expenseAmount').value = '';
  showError('');

  updateSummary();
  renderExpenseList();
}

// ── CALCULATE TOTALS 
function getTotalExpenses() {
  var total = 0;
  for (var i = 0; i < expenses.length; i++) {
    total = total + expenses[i].amount;
  }
  return total;
}

// ── UPDATE SUMMARY ON SCREEN 
function updateSummary() {
  var totalExpenses = getTotalExpenses();
  var balance       = salary - totalExpenses;

  document.getElementById('showSalary').textContent   = '₹' + salary;
  document.getElementById('showExpenses').textContent = '₹' + totalExpenses;
  document.getElementById('showBalance').textContent  = '₹' + balance;
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
    var li = document.createElement('li');
    li.innerHTML = '<span>' + expenses[i].name + '</span>' +
                   '<span>₹' + expenses[i].amount + '</span>';
    list.appendChild(li);
  }
}

// ── SHOW ERROR 
function showError(message) {
  document.getElementById('errorMsg').textContent = message;
}
