The project consist in testing an internal project of Qubika, both API and UI tests are to be run in just one file as per the requirments.

This project is divided in two parts, in the first part we are doing the tests on the API Level and if those pass we move on to the UI level, in both instances we try to cover as much as tests as possible, we'll see that in the test file all the tests or "sub" tests are divided in steps with this is much more clear to debug the issues found and also is much more clear to view it in the html report after the run.
Another way to test both API and UI level at the same time, would be to log in with the user in the UI, retrieve the token from the network, then do request to the API and check that after refreshing the newly created object appeared, this is helpful if we need to test the same exact object multiple times, with this we are able to reduce execution time and avoid re testing the UI x number of times.

To install the project just Download the project and install all dependencis with npm i.

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



CI/CD part:

The CI/CD for this project works on github actions, so when ever there's a push or pull request to the master branch the tests will be launched.

If that current version of the enviroment that we are testing failed the job will failed if it pass we will be able to see it with a green stick and to download the html report in the artifcat section of the job.