Download the project and install all dependencis with npm i

The project consist in testing an internal project of Qubika, both API and UI tests are to be run in just one file as per the requirments.

To run the project we can do either of the use the following commands on the console:

run any of the test in the project.
npx playwright test  

run the specific test headless
npx playwright test qubika.spec 

To run the test in headed mode, e.g:with the browser open.
npx playwright test qubika.spec --headed

To debug the test file
npx playwright test qubika.spec --debug

To open UI mode, run the following command in your terminal:

npx playwright test qubika.spec --ui

This project is divided in two parts, in the first part we are doing the tests on the API Level and if those pass we move on to the UI level, another way to test both API and UI level at the same time, would be to log in with the user in the UI, retrieve the token from the network, then do request to the API and check that after refreshing the newly created object appeared, this is helpful if we need to test the same exact object multiple times, with this we are able to reduce execution time and avoid re testing the UI x number of time.s