Download the project and install all dependencis with npm i

The project consist in testing an internal project of Qubika, both API and UI tests are to be run in just one file as per the requirments.

To run the project we can do either of the use the following commands on the console:

run any of the test in the project.
npx playwright test  

run the specific test headless
npx playwright test qubika.spec 

To run the test in headed mode, e.g:with the browser open.
npx playwright test qubika.spec --headed

To debug the test
npx playwright test qubika.spec --debug