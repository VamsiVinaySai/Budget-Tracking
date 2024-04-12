"use strict";

const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = 
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

/**
 * Generates a unique ID for the transaction. For now, simply generates the
 * exact millisecond the transaction was created.
 * @returns number that represents a unique ID
 */
function generateID(){
  return new Date().getTime();
}

/**
 * Adds the new transaction
 * @param {Event} e event when user presses submit button 'Add Transaction'
 */
function addTransaction(e) {
  e.preventDefault();

  if(text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a Transaction Name and Amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = '';
    amount.value = '';
  }

}


/**
 * Adds the transaction to the DOM
 * @param {*} transaction the amount of transaction (e.g, 20 or -10)
 */
function addTransactionDOM(transaction){
  const sign = transaction.amount < 0 ? '-' : '+';

  /* Recall: a list item in Transaction history follows the format:
      <li class="plus">Cash <span>+$700</span><button class="delete-btn">X</button></li>
  */
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML =  `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> 
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button></li>
  `;

  list.appendChild(item);
}


/**
 * Update the budget by calculating the balance, income, and expenses.
 */
function updateValues() {
  const amounts = transactions.map(transaction => 
    transaction.amount);
  const total = amounts
    .reduce((acc, val) => (acc += val), 0)
    .toFixed(2);
  const income = amounts
    .filter((transaction) => transaction > 0)
    .reduce((acc, val) => (acc += val), 0)
    .toFixed(2);

  const expense = amounts
    .filter((transaction) => transaction < 0)
    .reduce((acc, val) => (acc += val), 0)
    .toFixed(2);

  balance.innerHTML = `$${total}`;
  money_plus.innerHTML = `$${income}`;
  money_minus.innerHTML = `$${expense}`;
}

/**
 * Remove transaction by its ID from the DOM.
 * @param {number} id the unique id of the transaction
 */
function removeTransaction(id){
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

/**
 * Updates the localStorage on the user's browser with new transactions
 */
function updateLocalStorage(){
  localStorage.setItem('transactions', JSON.stringify(transactions));
}
function init(){
  list.innerHTML = ''; 
  transactions.forEach(addTransactionDOM);
  updateValues();
}
init();
form.addEventListener('submit', addTransaction);