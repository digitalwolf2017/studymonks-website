/* eslint-disable @typescript-eslint/no-explicit-any */
const debug = false;
const verbose = false;
export function log(...args: any[]): void {
  if (debug) {
    if (verbose) {
      const originalLog = console.log;
      // Preserve the original context
      originalLog.apply(console, args);
      // Add a stack trace to identify the original call site
      console.trace();
    } else {
      // Use a custom Error object to extract the stack trace
      const err = new Error();
      // Split the stack trace to get the caller information
      const stack = err.stack?.split("\n");
      const callerInfo = stack ? stack[2].trim() : "Caller info not available";

      // Extract only the file and line/column information
      const callerInfoMatch = callerInfo.match(/\(([^)]+)\)/);
      const simplifiedCallerInfo = callerInfoMatch
        ? callerInfoMatch[1].split("/").slice(-2).join("/")
        : callerInfo;

      // Clean up the extracted info to ensure only file and line number are shown
      const cleanCallerInfo = simplifiedCallerInfo.replace(
        /^.*\/([^/]+\/[^/]+)$/,
        "$1"
      );

      // Append caller information to the log
      console.log(...args, `\n${cleanCallerInfo}`);
    }
  }
}
// Function to display the warning message
// function displayConsoleWarning() {
//     const message = `
//     %cSTOP!
//     %cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable an Tutopia feature or "hack" someone's account, it is a scam and will give them access to your Tutopia account.
//     `;
//     const styleTitle = 'color: red; font-size: 30px; font-weight: bold;';
//     const styleMessage = 'color: black; font-size: 14px;';

//     console.log(message, styleTitle, styleMessage);

//     // If you want to display a logo, you can use an image URL
//     const logoUrl = 'https://www.tutopia.com/assets/images/tutopia-logo-full.svg'; // Replace with your logo URL
//     console.log('%c ', `font-size: 100px; background: url(${logoUrl}) no-repeat;`);
// }

// Self-invoking function to monitor console access
// (function() {
//     if (!debug) {
//         window.addEventListener('devtoolschange', displayConsoleWarning);
//         displayConsoleWarning();
//     }
// })();
