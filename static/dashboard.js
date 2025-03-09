document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const totalIncomeElement = document.getElementById("total-income");
    const totalExpenditureElement = document.getElementById("total-expenditure");
    const filterCategory = document.getElementById("filter-category");

    let expenses = [];
    let editingExpense = null; // Track which expense is being edited

    // Load expenses from localStorage on page load
    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses = storedExpenses;
    renderAll();

    // Form submission
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        if (editingExpense) {
            // Update the existing expense
            Object.assign(editingExpense, { name, amount, category, date });
            editingExpense = null;
            expenseForm.querySelector("button").textContent = "Add Expense"; // Reset button label
        } else {
            // Add a new expense
            expenses.push({ id: Date.now(), name, amount, category, date });
        }

        saveExpenses();
        renderAll();
        expenseForm.reset();
    });

    // Handle expense list actions (edit/delete)
    expenseList.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.classList.contains("delete-btn")) {
            expenses = expenses.filter(expense => expense.id !== id);
        } else if (e.target.classList.contains("edit-btn")) {
            editingExpense = expenses.find(expense => expense.id === id);
            populateForm(editingExpense);
        }
        saveExpenses();
        renderAll();
    });

    // Filter expenses by category
    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        renderFilteredExpenses(category);
    });

    // Render all components
    function renderAll() {
        displayExpenses(expenses);
        updateTotalAmount();
        updateTotalIncomeExpenditure();
        renderCharts();
    }

    // Populate the form for editing
    function populateForm(expense) {
        document.getElementById("expense-name").value = expense.name;
        document.getElementById("expense-amount").value = expense.amount;
        document.getElementById("expense-category").value = expense.category;
        document.getElementById("expense-date").value = expense.date;
        expenseForm.querySelector("button").textContent = "Update Expense"; // Change button label
    }

    // Display expenses in the table
    function displayExpenses(expenseListData) {
        expenseList.innerHTML = expenseListData.map(expense => `
            <tr>
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Update total expenditure and income
    function updateTotalIncomeExpenditure() {
        const totalIncome = parseFloat(totalIncomeElement.textContent.replace('$', '')) || 0;
        const totalExpenditure = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalExpenditureElement.textContent = `$${totalExpenditure.toFixed(2)}`;
    }

    // Update the total expense amount
    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }

    // Filter expenses by category and render
    function renderFilteredExpenses(category) {
        const filteredExpenses = category === "All" ? expenses : expenses.filter(expense => expense.category === category);
        displayExpenses(filteredExpenses);
    }

    // Save expenses to localStorage
    function saveExpenses() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    // Render charts for data visualization
    function renderCharts() {
        const totalIncome = parseFloat(totalIncomeElement.textContent.replace('$', '')) || 0;
        const totalExpenditure = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remainingIncome = totalIncome - totalExpenditure;

        const categories = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const categoryLabels = Object.keys(categories);
        const categoryData = Object.values(categories);

        // Destroy existing charts before rendering new ones
        Chart.getChart('pie-chart')?.destroy();
        Chart.getChart('bar-chart')?.destroy();

        // Pie chart
        new Chart(document.getElementById('pie-chart'), {
            type: 'pie',
            data: {
                labels: categoryLabels,
                datasets: [{
                    data: categoryData,
                    backgroundColor: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99'],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });

        // Bar chart
        new Chart(document.getElementById('bar-chart'), {
            type: 'bar',
            data: {
                labels: ['Remaining Income', 'Expenditure'],
                datasets: [{
                    label: 'Amount',
                    data: [remainingIncome, totalExpenditure],
                    backgroundColor: ['#66b3ff', '#ff6666'],
                    borderColor: ['#0059b3', '#b30000'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: totalIncome
                    }
                }
            }
        });
    }
});

