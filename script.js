// 1. Find the form on the page
const form = document.getElementById("expense-form");

// 2. Create an empty lit to hold our expenses
const expenses = [];

// 3. Run this code whenever the form is submitted
form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    // 4. Read the values the user typed
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("amount").value);
    const department = document.getElementById("department").value;

    // 5. Bundle them into one object
    const expense = { date, category, amount, department };

    // 6. Add it to the list
    expenses.push(expense);

    // 7. Show the result in the browser's console
    console.log(expenses);

    // 8. Clear the form
    form.reset();
});