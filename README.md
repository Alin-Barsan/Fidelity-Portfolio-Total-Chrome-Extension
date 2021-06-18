# Fidelity Portfolio Total Chrome Extension
A simple Chrome extension that subtracts any stock plan account balances from your portfolio total.

## Purpose
When you have an unvested stock grant, the money is not really yours because you won't receive it for years.

It's annoying to see this reflected in your current portfolio total value, and apparently there's no way to configure this or hide this, like you can with any other account of yours using the 'Customize' button in the top left of the view on the Fidelity page.  

I don't want to do the mental math subtracting account totals every time I check on my investments.  So I built this!

## Installation
1. Download all files in this repo and place them in a folder somewhere on your computer.
2. Go to Chrome and open: chrome://extensions/
3. Click the "Load Unpacked" button in the top left
4. Select the folder you created and hit "Select Folder"
5. The browser extension should be loaded and will activate the next time you go to your Fidelity portfolio view.


## Troubleshooting:
### The Extension Isn't Activating
The manifest.json file controls on which site this extension will activate.  It's originally set to https://oltx.fidelity.com/*  This is because my url was https://oltx.fidelity.com/ftgw/fbc/oftop/portfolio#summary when looking at my portfolio.  If fidelity changes this base URL, then you need to update the pattern matching in the manifest file.  This is definitely the case if you check your extensions and see that it's in the "no access needed" section when looking at your portfolio.

### The Extension Is Activated But Not Working
The content.js file contains all the javascript.  It's heavily documented and full of warnings about the lazy assumptions I made when throwing this together.  Over time, Fidelity can (and probably will) change the class / div attribute patterns that I used to find the account balances.  You can update these by looking at the elements that we're supposed to be interacting with and using 'inspect' to see the page source code, and try to identify the new patterns needed.

You can also open the console (inspect anywhere on the page, and then go to the console tab) and check for any errors that may have occurred during the execution of the extension's script.  I found this super helpful when debugging the creation of this.  In fact, you can go line-by-line (or chunk-by-chunk of code and logic) in the script and copy-paste it into the console to execute it (make sure to do this in order).  This can help you isolate specifically which section is broken.

### This Extension Doesn't Work On Other Fidelity Pages (Like NetBenefits)
The manifest is configured only to work on that one base URL.  You could update it to match and thus activate for other base URLs, but the javascript logic that looks for specific elements will most likely fail on other pages as they'll have different class names and attributes.  Sorry!

### The Extension Is Mis-Calculating My Total (Or Making It Negative)
This can be caused by the observer triggering too aggressively / often and pulling you negative, or by the pattern matching for the stock plan accounts accidentally triggering on non-intended accounts.  I would begin investing either of those.  If your page is freezing or hanging, you may have found yourself in an infinite observer loop where your changes to the portfolio total are somehow triggering the observer.  This should have been accounted for, but if it's happening, just disable your extension and then debug accordingly.
