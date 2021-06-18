/*
    This file contains a script that tries to:
    - Identify the section containing the total portfolio value
    - Extract the value from that section and save it
    - Identify all sections containing the values of stock plan accounts
    - Extract the value from those sections and subtract it from the saved total value
    - Write the resulting value (original total - stock plan accounts) back to the section containing the portfolio value
*/

// Define a function that turns a string like "$1,000.23" to a numeric value we can operate on.
// Taken from: https://www.geeksforgeeks.org/how-to-convert-a-currency-string-to-a-double-value-with-jquery-or-javascript/
function convert(num) {
    // Using replace() method to make currency string suitable for parseFloat() to convert 
    return parseFloat(num.replace(/[^0-9.-]+/g,""));
}

// Define a formatter that lets us convert our new calculated portfolio value back to a human-friendly format.
// Taken from: https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});


// This first section has a few lazy assumptions that may need updating if Fidelity updates their site:
// 1. The class name of the element containing the value is hardcoded here.
// 2. This assumes there's only one element matching this hardcoded class.  It selects and uses the first match.
// 3. This assumes the value is contained directly in this element (not in some sub-section within it).
// All of these assumptions held true in Fidelity's web page structure at the time when I made this.  Things may change.

// Identify the section containing the total portfolio value
var portfolioTotalElement = document.getElementsByClassName('account-selector--tab-row account-selector--all-accounts-balance js-portfolio-balance')[0];

// Extract the value from that section and save it
var modifiedNumericTotal = convert(portfolioTotalElement.textContent);

// Note: similar assumptions as described earlier are made for the Stock Plan accounts.
// Thus, this logic may also need updates over time if fidelity changes things.

// Identify all sections containing the values of stock plan accounts
// First, gets all containers marked as belonging to a stock plan
var stockPlanContainerElements = document.querySelectorAll("[data-acct-type='Stock Plans']");
stockPlanContainerElements.forEach(element => {
    // Second, for each stock plan section, find all stock plan account balances
    var stockPlanBalanceElements = element.getElementsByClassName("account-selector--tab-row account-selector--account-balance  js-acct-balance");
    Array.from(stockPlanBalanceElements).forEach(balanceElement => {
        // Third, for each stock plan balance element:
        // Extract the value, convert it to numeric, and subtract it from the running portfolio total.
        modifiedNumericTotal = modifiedNumericTotal - convert(balanceElement.innerText);
    });
});

// Write the resulting value (original total - stock plan accounts) back to the section containing the portfolio value
portfolioTotalElement.innerHTML = formatter.format(modifiedNumericTotal);
