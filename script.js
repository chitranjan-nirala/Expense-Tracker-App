
//...............   working scriptt comonent.........................//

const incRemov = document.querySelector('.incRemove');
const expRemov = document.querySelector('.expRemove');
const incbtn = document.querySelector('.income');
const expbtn = document.querySelector('.expense');
const lists = document.querySelector('#list');
const forms = document.querySelector('#form');
const text = document.querySelector('#text');
const amount = document.querySelector('#amount');
const balances = document.querySelector('#balance');
const pluses = document.querySelector('.plus');
const minuses = document.querySelector('.minus');

const incs = (e) => {
    incRemov.classList.remove('hidden');
    expRemov.classList.add('hidden');
};

const expe = (e) => {
    expRemov.classList.remove('hidden');
    incRemov.classList.add('hidden');
};

incbtn.addEventListener('click', incs);
expbtn.addEventListener('click', expe);

let transactions = [];
const localData = JSON.parse(localStorage.getItem('transactions'));
transactions = localData !== null ? localData : [];

function addAmount(e) {
    e.preventDefault();
    if (text.value.trim() === '' || amount.value === '') {
        alert('Fill the transaction name & amount');
    } else {
        const transaction = {
            Id: generateID(),
            text: text.value,
            amount: +amount.value
        };
        transactions.push(transaction);
        add(transaction);
        updateValues();
        updateData();
        text.value = '';
        amount.value = '';
    }
}

function generateID() {
    return Math.floor(Math.random() * 10000000000);
}

function add(transaction) {
    let sign;
    if (transaction.amount < 0) {
        sign = '-';
    } else {
        sign = '+';
    }
    const item = document.createElement('li');
    item.innerHTML = `<span> <i class="fa-sharp fa-regular fa-circle-xmark fa-sm" onclick= "removeTransaction(${transaction.Id})"></i></span> ${transaction.text}<span>${sign}${Math.abs(transaction.amount)}</span>`;
    lists.appendChild(item);
}

// .............adding a chart for income and expenses...........

let chart; // Declare chart variable globally

function createChart(income, expense) {
  const chartElement = document.getElementById('incomeExpenseChart').getContext('2d');
  if (typeof income === 'undefined' || typeof expense === 'undefined') {
    return; // Exit if income and expense are not defined
  }

  chart = new Chart(chartElement, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: 'Amount',
        data: [income, expense],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Income vs. Expense'
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function updateChart(income, expense) {
  if (typeof income === 'undefined' || typeof expense === 'undefined') {
    return; // Exit if income and expense are not defined
  }

  chart.data.datasets[0].data = [income, expense];
  chart.update();
}

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
  const expense = Math.abs(amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0));

  balances.innerHTML = `$${(income - expense).toFixed(2)}`;
  pluses.innerHTML = `+$${income.toFixed(2)}`;
  minuses.innerHTML = `-$${expense.toFixed(2)}`;

  updateChart(income, expense); // Call the updateChart function here with the calculated income and expense values
}

createChart(0, 0); // Create the initial chart with 0 values

// end of the chart js...............////

function removeTransaction(Id) {
    transactions = transactions.filter((transaction) => transaction.Id !== Id);
    updateData();
    run();
}

function updateData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function run() {
    transactions.forEach(add);
    updateValues();
}
run();

forms.addEventListener('submit', addAmount);
