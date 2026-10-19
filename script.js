// Format number as Rupiah, e.g. 10000 -> "Rp 10.000"
function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
}

// 1. Find the form on the page
const form = document.getElementById("expense-form");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

// null = adding a new expense, a number = editing the expese with that id
let editingId = null;

const filterCategory = document.getElementById("filter-category");

const expenseList = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");

// Load saved expenses from the browser, or start with an empty list
function loadExpenses() {
    const saved = localStorage.getItem("expenses");
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch (error) {
        console.error("Saved data is corrupted, starting fresh.", error);
        return [];
    }
}

let expenses = loadExpenses();

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses() {
    // 1. Decide which expense to show
    const selected = filterCategory.value;
    const visibleExpenses = 
        selected === "all"
            ? expenses
            : expenses.filter(function (expense) {
                return expense.category === selected;
            });

    // 2. Clear the table
    expenseList.innerHTML = "";

    // 3. Add one row per VISIBLE expense
    visibleExpenses.forEach(function (expense) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>${expense.department}</td>
            <td>${formatRupiah(expense.amount)}</td>
            <td>""
                <button class="btn btn-sm btn-warning" data-action="edit" data-id="${expense.id}">Edit</button>
                <button class="btn btn-sm btn-danger" data-action="delete" data-id="${expense.id}">Delete</button>
            </td>
        `;
        expenseList.appendChild(row);
    });

    // 4. Total of the VISIBILE expenses
    const total = visibleExpenses.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    totalDisplay.textContent = formatRupiah(total);
}

function startEdit(id) {
    // Find the expense we want to edit
    const expense = expenses.find(function (item) {
        return item.id === id;
    });
    if (!expense) return;

    // Put its values into the form
    document.getElementById("date").value = expense.date;
    document.getElementById("category").value = expense.category;
    document.getElementById("amount").value = expense.amount;
    document.getElementById("department").value = expense.department;

    // Switch to edit mode
    editingId = id;
    submitBtn.textContent = "Save Changes";
    cancelBtn.classList.remove("d-none");
}

function resetForm() {
    form.reset();
    editingId = null;
    submitBtn.textContent = "Add Expense";
    cancelBtn.classList.add("d-none");
}

cancelBtn.addEventListener("click", resetForm);

expenseList.addEventListener("click", function (event) {
    // Only react when delete button was clicked
    if (!event.target.matches("button[data-id]")) return;

    const id = Number(event.target.dataset.id);
    const action = event.target.dataset.action;

    if (action === "edit") {
        startEdit(id);
    } else if (action === "delete") {
        expenses = expenses.filter(function (expense)  {
            return expense.id !== id;
        });

        // If we just deleted the expense being edited, leave edit mode
        if (id === editingId) resetForm();

        saveExpenses();
        renderExpenses();
    }

});

// 3. Run this code whenever the form is submitted
form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    // 4. Read the values the user typed
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("amount").value);
    const department = document.getElementById("department").value;

    if (editingId === null) {
        // Add mode: create a new expense
        expenses.push({ id: Date.now(), date, category, amount, department});
    } else {
        // Edit mode: replace the matching expense, keep the others
        expenses = expenses.map(function (expense) {
            if (expense.id === editingId) {
                return { id: expense.id, date, category, amount, department };
            }
            return expense;
        });
    }

    saveExpenses();
    renderExpenses();
    resetForm();
});

filterCategory.addEventListener("change", renderExpenses);
renderExpenses();