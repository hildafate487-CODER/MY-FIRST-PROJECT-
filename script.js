let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expensesElement = document.getElementById("expenses");
const transactionList = document.getElementById("transactionList");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const typeInput = document.getElementById("type");
const addButton = document.getElementById("addTransaction");

addButton.addEventListener("click", addTransaction);

function addTransaction() {
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const type = typeInput.value;

    if (description === "" || amount <= 0 || date === "") {
        alert("Please enter a description, amount, and date.");
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        date: date,
        type: type
    };

    transactions.push(transaction);

    saveTransactions();

    descriptionInput.value = "";
    amountInput.value = "";
    dateInput.value = "";

    updateTracker();
}

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateTracker() {
    let income = 0;
    let expenses = 0;

    transactions.forEach(function(transaction) {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
    });

    const balance = income - expenses;

    incomeElement.textContent = "UGX " + income.toLocaleString();
    expensesElement.textContent = "UGX " + expenses.toLocaleString();
    balanceElement.textContent = "UGX " + balance.toLocaleString();

    displayTransactions();
}

function displayTransactions() {
    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        transactionList.innerHTML =
            '<li class="empty-message">No transactions yet.</li>';
        return;
    }

    transactions.forEach(function(transaction) {
        const li = document.createElement("li");

        li.innerHTML = `
            <span>
                ${transaction.description}
                <strong>${transaction.type}</strong>
                <small>${transaction.date}</small>
            </span>

            <span>
                UGX ${transaction.amount.toLocaleString()}
                <button onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            </span>
        `;

        transactionList.appendChild(li);
    });
}

function deleteTransaction(id) {
    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveTransactions();
    updateTracker();
}

updateTracker();