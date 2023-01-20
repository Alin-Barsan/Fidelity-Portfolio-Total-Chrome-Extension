
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

function getPortfolioTotal() {
	var accountBalances = Array.from(document.getElementsByClassName("acct-selector__acct-balance"))
	var totalAccountBalance = 0;
	accountBalances.forEach(element => {
		totalAccountBalance = totalAccountBalance + convert(element.innerText);
	});
	return totalAccountBalance;
}

function getFilteredAccountTotal(selector) {
		// We want to identify all sections containing the selector-matched accounts, but they don't have obvious JS classes...
		// First, gets all account name (or number) elements with the selector somewhere in their text.
		var namedElements = Array.from(document.querySelectorAll(".acct-selector__acct-num,.acct-selector__acct-name")).filter(el => el.textContent.includes(selector))
		var accountTotals = 0
		namedElements.forEach(element => {	
			// Second, work our way "up" the tree to find all account wrappers containing these elements
			var accountWrapper = element.closest(".acct-selector__acct-wrapper")
			// Third, work our way back "down" from the wrapper to find the actual account balances within the wrapper
			var balanceElements = accountWrapper.getElementsByClassName("acct-selector__acct-balance");
			Array.from(balanceElements).forEach(balanceElement => {
				// Lastly, for each stock plan balance element:
				// Extract the value, convert it to numeric, and subtract it from the running portfolio total.
				accountTotals = accountTotals + convert(balanceElement.innerText);
			});
		});
		
		return accountTotals
}

function updatePortfolioTotal() {
	
	// Because we're repeating this frequently and may have errors if the DOM isn't fully loaded, we try/catch and swallow exceptions here
	try {

		// Identify the section containing the total portfolio value
		var portfolioTotalElement = document.getElementsByClassName("acct-selector__all-accounts-balance")[0];

		// Write the resulting value (original total - stock plan accounts) back to the section containing the portfolio value
		portfolioTotalElement.innerHTML = formatter.format(getPortfolioTotal() - getFilteredAccountTotal("Stock") - getFilteredAccountTotal("Visa"));

	} catch (e) {}
 
}

setInterval(updatePortfolioTotal, 250);
