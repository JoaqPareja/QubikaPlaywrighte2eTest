The project consist in testing the internal project of Qubika, both API and UI tests are to be run in just one file as per the requirments.
UI URL:https://api.club-administration.qa.qubika.com/swagger-ui/index.html#/
Swagger URL:https://club-administration.qa.qubika.com/#/category-type

This project is divided in two parts, in the first part we are doing the tests on the API Level and if those pass we move on to the UI level, in both instances we try to cover as much as tests as possible, we'll see that in the test file all the tests or "sub" tests are divided in steps with this is much more clear to debug the issues found and also is much more clear to view it in the html report after the run.
Another way to test both API and UI level at the same time, would be to log in with the user in the UI, retrieve the token from the network, then do request to the API and check that after refreshing the newly created object appeared, this is helpful if we need to test the same exact object multiple times, with this we are able to reduce execution time and avoid re testing the UI x number of times.

To install the project just Download or clone the project and install all dependencis with npm i.

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

API Comments:
From the API level there's almost no restriction to do test the Application.
Although there's no restriction there are some methods, like the post method that should return 201, which is used for creating objects, some of the post request like the /category-type/create endpoint return 200, is weird that is used here a 200 given that for registering a user it does return 201, which indicates that the server has successfully processed the request, the new resource has been created and is now ready for interaction.

UI Comments:
From the start, there's seems to be like a glitch or a general issue, that it tries to enter the dashboard instead of the login and after 3 or 5 seconds it gets into the login page, this would need to be check.
Another improvement on the login page is that we don't have the option to register our user, we can do that on the API level but we do not have the option to do it in the UI, i did saw that we can create users after logged in, so i wouldn't know if that's made on purspose or not to not be able to create user ro to choose between create a user or log in.
One step that couldn't be completed at the UI level was checking the creation of the categories, as we don't have a way like a search bar to search for the newly created one, also when we create a category it should appear right away in the UI, it does not appear, the only way so far i would be able to know that it was created would be to check the subcategory dropdown where i can check all categories.
Also changing categories in the categories type does not scroll, it seems to be fixed and the page selection seems to be "stuck" as well on the screen, not allowing us to change the number of the page and the next button does not work, definetely worth cheecking out.
Another thing to mention is that the the Log out button(salir) does not appear to exist when launching the test using playwright, definetly worth checking out.