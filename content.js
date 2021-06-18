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


// Define the pointer to the element that contains the portfolio total outside the function so we can access this elsewhere
var portfolioTotalElement;

// Save the process of updating the portfolio total so we can have the extension repeat this logic as needed
function updatePortfolioTotal() {

    // This first section has a few lazy assumptions that may need updating if Fidelity updates their site:
    // 1. The class name of the element containing the value is hardcoded here.
    // 2. This assumes there's only one element matching this hardcoded class.  It selects and uses the first match.
    // 3. This assumes the value is contained directly in this element (not in some sub-section within it).
    // All of these assumptions held true in Fidelity's web page structure at the time when I made this.  Things may change.

    // Identify the section containing the total portfolio value
    portfolioTotalElement = document.getElementsByClassName('account-selector--tab-row account-selector--all-accounts-balance js-portfolio-balance')[0];

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
}

// Update the portfolio total once on page load
updatePortfolioTotal()

// Configure an observer to listen to changes to the portfolio total - this indicates that Fidelity has refreshed / recalculated the total,
// so we should too.  Note that we can also trigger this... so we updated the portfolio already above this definition.
// This implementation is from: https://stackoverflow.com/questions/29405279/detect-div-change-in-javascript
var config = { attributes: true, childList: true, characterData: true }
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        // At this point we have detected that the portfolio total has changed.  But we don't want to end up in an infinite loop,
        // so we disconnect the observer, THEN write our updated portfolio total, then re-register the observer on the element.
        observer.disconnect();
        updatePortfolioTotal();
        observer.observe(portfolioTotalElement, config);
    });
});

// Register the observer on the portfolio total element - this is the first time it's registered, as the above is just the configuration
// on how it behaves when the mutation of the watched element is observed.
observer.observe(portfolioTotalElement, config);
