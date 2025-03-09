function calculate() {
    // Get the input value
    const value = parseFloat(document.getElementById("value-input").value);

    // Check if the input is valid
    if (isNaN(value)) {
        alert("Please enter a valid number!");
        return;
    }

    // Calculate the percentages
    const fiftyPercent = (value * 0.5).toFixed(2);
    const thirtyPercent = (value * 0.3).toFixed(2);
    const twentyPercent = (value * 0.2).toFixed(2);

    // Update the result cards
    document.getElementById("result-50").textContent = fiftyPercent;
    document.getElementById("result-30").textContent = thirtyPercent;
    document.getElementById("result-20").textContent = twentyPercent;
}