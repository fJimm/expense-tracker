// Format number as Rupiah, e.g. 10000 -> "Rp 10.000"
function formatRupiah(Number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number);
}

// 1. Find the form on the page
const form = document.getElementById("expense-form");

const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");

// 2. Create an empty lit to hold our expenses
let expenses = [];

function renderExpenses() {
    // 1. Clear the table
    expenseList.innerHTML = "";

    // 2. Add one row per expense
    expenses.forEach(function (expense) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>${expense.department}</td>
            <td>${formatRupiah(expense.amount)}</td>
            <td>
                <button class="btn btn-sm btn-danger" data-id="${expense.id}">Delete</button>
            </td>
        `;
        expenseList.appendChild(row);
    });

    // 3. Calculate the total
    const total = expenses.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    // 4. Show the total
    totalDisplay.textContent = formatRupiah(total);
}

expenseList.addEventListener("click", function (event) {
    // Only react when delete button was clicked
    if (!event.target.matches("button[data-id]")) return;

    const id = Number(event.target.dataset.id);

    // Keep every expense EXCEPT the one wwith this id
    expenses = expenses.filter(function (expense) {
        return expense.id !== id;
    });

    renderExpenses();
})

// 3. Run this code whenever the form is submitted
form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    // 4. Read the values the user typed
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("amount").value);
    const department = document.getElementById("department").value;

    // 5. Bundle them into one object
    const expense = { id: Date.now(), date, category, amount, department };

    // 6. Add it to the list
    expenses.push(expense);
    renderExpenses();

    // 7. Show the result in the browser's console
    console.log(expenses);

    // 8. Clear the form
    form.reset();
});