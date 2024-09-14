import { expect } from '@playwright/test';
import { test } from '../customTypes/testData';
import UILogin from "../POM/UI/login"
import UISideMenu from "../POM/UI/sideMenu"
import UICategories from "../POM/UI/categories"
import APILogin from "../POM/API/login"
import APICategories from "../POM/API/categories"
import APIRegister from "../POM/API/register"
import {registerANewUser} from "../helpers/registerANewUser"
test.use({video: 'on'});
test.setTimeout(140000);

    test('Qubika test', async ({ page,email,userName,password, emailNotRegistered,passwordNotRegistered,nameCategory,colorBackGroundToExpect}) => {
      const uILogin = new UILogin(page)
      const uISideMenu =new UISideMenu(page)
      const uICategories =new UICategories(page);
      const aPILogin= new APILogin(page)
      const aPICategories= new APICategories(page);
      const aPIRegister=new APIRegister(page)
      await test.step('API test', async ()=>{
          
        await test.step('Check that we can not log in with a wrong email a password', async ()=>{
          const apiLoginResponse= await aPILogin.logToTheWebSite(email,password)
          const apiLoginResponeJson = await apiLoginResponse.json()
          expect(apiLoginResponse.ok()).toBeTruthy();
          expect(apiLoginResponse.status()).toBe(200)
          process.env.ID_TOKEN =await apiLoginResponeJson.token//Get the Auth token and create an enviroment variable to be able to re use it
        });
        await test.step('Check that we can retrive the user information', async ()=>{
          const apiLoginResponse= await aPILogin.getUserAccountInformation(`${process.env.ID_TOKEN}`)
          const apiLoginResponeJson = await apiLoginResponse.json()
          expect(apiLoginResponse.ok()).toBeTruthy();
          expect(apiLoginResponse.status()).toBe(200)
          expect(await apiLoginResponeJson.username).toEqual(userName);
          expect(await apiLoginResponeJson.email).toEqual(email);
          expect(await apiLoginResponeJson.roles[0]).toEqual('ROLE_ADMIN');
        });
        await test.step('Get to the categories and create one', async ()=>{
          await test.step('Check that we are able to check categories before creating one', async ()=>{
            const apiLoginResponse= await aPICategories.getCategories(`${process.env.ID_TOKEN}`)
            expect(apiLoginResponse.ok()).toBeTruthy();
            expect(apiLoginResponse.status()).toBe(200)
          })
          await test.step('Create a category', async ()=>{
            const apiLoginResponse= await aPICategories.createACategory(`${process.env.ID_TOKEN}`,nameCategory,null)
            const apiLoginResponeJson = await apiLoginResponse.json()
            expect(apiLoginResponse.ok()).toBeTruthy();
            expect(apiLoginResponse.status()).toBe(200)
            expect(apiLoginResponeJson.id).not.toBeNull();
            expect(apiLoginResponeJson.name).not.toBeNull();
            expect(apiLoginResponeJson.parentId).toBeNull();
            process.env.FATHER_CATEGORY_ID_FROM_API=apiLoginResponeJson.id
            await test.step('Check that the category has been created', async ()=>{
              const getCategoryByIDReponse=await aPICategories.getCategoryByID(`${process.env.ID_TOKEN}`,`${process.env.FATHER_CATEGORY_ID_FROM_API}`)
              const getCategoryByIDReponseJson = await getCategoryByIDReponse.json()
              expect(getCategoryByIDReponse.ok()).toBeTruthy();
              expect(getCategoryByIDReponse.status()).toBe(200)
              expect(getCategoryByIDReponseJson.name).toEqual(nameCategory)
            })
          })
          await test.step('Create a Sub category', async ()=>{
            const apiLoginResponse= await aPICategories.createACategory(`${process.env.ID_TOKEN}`,nameCategory,`${process.env.FATHER_CATEGORY_ID_FROM_API}`)
            const apiLoginResponeJson = await apiLoginResponse.json()
            expect(apiLoginResponse.ok()).toBeTruthy();
            expect(apiLoginResponse.status()).toBe(200)
            expect(apiLoginResponeJson.id).not.toBeNull();
            expect(apiLoginResponeJson.name).not.toBeNull();
            expect(apiLoginResponeJson.parentId).not.toBeNull();
            const categoryCreatedFromAPILevel=apiLoginResponeJson.id
            await test.step('Check that the subcategory category has been created', async ()=>{
              const getCategoryByIDReponse=await aPICategories.getCategoryByID(`${process.env.ID_TOKEN}`,categoryCreatedFromAPILevel)
              const getCategoryByIDReponseJson = await getCategoryByIDReponse.json()
              expect(getCategoryByIDReponse.ok()).toBeTruthy();
              expect(getCategoryByIDReponse.status()).toBe(200)
              expect(getCategoryByIDReponseJson.name).toEqual(nameCategory)
              process.env.SUB_CATEGORY_ID_FROM_API=apiLoginResponeJson.id
              expect(process.env.SUB_CATEGORY_ID_FROM_API).not.toBeNull();
              expect(process.env.SUB_CATEGORY_ID_FROM_API).not.toBe(`${process.env.FATHER_CATEGORY_ID_FROM_API}`)
            })
          })
          await test.step('Delete sub Category', async ()=>{
           const deleteSubCategory= await aPICategories.deleteCategory(`${process.env.ID_TOKEN}`,`${process.env.SUB_CATEGORY_ID_FROM_API}`)
           expect(deleteSubCategory.ok()).toBeTruthy();
           expect(deleteSubCategory.status()).toBe(200);
           await test.step('Check that the sub Category no longer exist', async ()=>{
              const getCategoryByIDReponse=await aPICategories.getCategoryByID(`${process.env.ID_TOKEN}`,`${process.env.SUB_CATEGORY_ID_FROM_API}`)
              expect(getCategoryByIDReponse.status()).toBe(404);
            });
            await test.step('Check that although the sub category has been deleted in the previous step we still have the father category', async ()=>{
              const getCategoryByIDReponse=await aPICategories.getCategoryByID(`${process.env.ID_TOKEN}`,`${process.env.FATHER_CATEGORY_ID_FROM_API}`)
              expect(getCategoryByIDReponse.ok()).toBeTruthy();
              expect(getCategoryByIDReponse.status()).toBe(200);
            })
          });
          await test.step('Delete Category', async ()=>{
            const deleteFatherCategory= await aPICategories.deleteCategory(`${process.env.ID_TOKEN}`,`${process.env.FATHER_CATEGORY_ID_FROM_API}`)
            expect(deleteFatherCategory.ok()).toBeTruthy();
            expect(deleteFatherCategory.status()).toBe(200);
            await test.step('Check the Category no longer exist', async ()=>{
              const getCategoryByIDReponse=await aPICategories.getCategoryByID(`${process.env.ID_TOKEN}`,`${process.env.FATHER_CATEGORY_ID_FROM_API}`)
              expect(getCategoryByIDReponse.status()).toBe(404);
            });

          });

        });
        
      })
      await test.step('UI test', async ()=>{

        await test.step('Get to the Log in page and check that we landed in the right page', async ()=>{
          await page.goto('/');
          await expect(page).toHaveURL(/.*club-administration.qa.qubika.com/)
          await expect(page).toHaveURL(/.login/)
          await page.waitForTimeout(300);
        })

        await test.step('Check message for an incorrect email and password', async()=>{
          await test.step('Type Incorrectly user email', async ()=>{
            await uILogin.fillUserName(emailNotRegistered)
            await uILogin.jumpToPasswordFromUserName();
          })
          await test.step('Type user password', async ()=>{
            await uILogin.fillUserPassword(passwordNotRegistered)
          })
          await test.step('Click on the authenticate button', async()=>{
            await uILogin.clickOnAuthenticateButton();
          })
          await test.step('Verify that the pop up for wrong user name or password appear on the screen',async ()=>{
            await expect(uILogin.popUpWrongUsernameOrPasswrod).toBeVisible();
          })
        })
        await test.step('Register the user on the API level and check we can log in the UI', async ()=>{
          await test.step('Create the user on the API level', async ()=>{
            const apareRegisterUser= await aPIRegister.registerUSer(await registerANewUser() ,passwordNotRegistered)
            const getCategoryByIDReponseJson = await apareRegisterUser.json()
            expect(apareRegisterUser.ok()).toBeTruthy();
            expect(apareRegisterUser.status()).toBe(201)
            expect(getCategoryByIDReponseJson.email).toEqual(process.env.NEWUSER)
          })
          await test.step('Type user email', async ()=>{
            await uILogin.fillUserName(`${process.env.NEWUSER}`)
            await expect(uILogin.userEmailLocator).toHaveValue(`${process.env.NEWUSER}`) // Why toHaveValue instead of toHaveText ? because the input saves it as value and not as as text
            await uILogin.jumpToPasswordFromUserName();
          })
          await test.step('Type user password', async ()=>{
            await uILogin.fillUserPassword(passwordNotRegistered)
            await expect(uILogin.userPasswordLocator).toHaveValue(passwordNotRegistered)
          })
          await test.step('Click on the authenticate button', async()=>{
            await uILogin.clickOnAuthenticateButton();
            const AUTH_RESPONSE = await uILogin.authLogin();
            const ACC_RESPONSE= await uILogin.checkAccountResponse();
            expect(AUTH_RESPONSE.status()).toBe(200);
            expect(ACC_RESPONSE.status()).toBe(200)
          })
          await test.step('Check we landed on the dashboard', async()=>{
            await expect(page).toHaveURL(/.*dashboard/)
            await page.waitForTimeout(300);//emulate user behavior
            await expect(uISideMenu.qubikaBrandIcon).toBeVisible();
            await page.waitForTimeout(300);//emulate user behavior
          });
          await test.step('go back to the log user scren', async ()=>{
            await page.goBack(); //Here i will click on the log out button but for some reason when opening the chromium it does not exist the element
            await expect(page).toHaveURL(/.login/) //Assert we landed on the login 
            await page.waitForTimeout(300);
          })

        })

        await test.step('Log in with Qubika Admin User', async()=>{
          await test.step('Type user email', async ()=>{
            await uILogin.fillUserName(email)
            await expect(uILogin.userEmailLocator).toHaveValue(email) // Why toHaveValue instead of toHaveText ? because the input saves it as value and not as as text
            await uILogin.jumpToPasswordFromUserName();
          })
          await test.step('Type user password', async ()=>{
            await uILogin.fillUserPassword(password)
            await expect(uILogin.userPasswordLocator).toHaveValue(password)
          })
          await test.step('Remember me step',async()=>{
            await uILogin.clickOnRembemberMe();
            await uILogin.clickOnRembemberMe();
            await expect(uILogin.inputRadio).toHaveCSS('background-color',colorBackGroundToExpect)
          })
          await test.step('Click on the authenticate button', async()=>{
            await uILogin.clickOnAuthenticateButton();
            const AUTH_RESPONSE = await uILogin.authLogin();
            const ACC_RESPONSE= await uILogin.checkAccountResponse();
            expect(AUTH_RESPONSE.status()).toBe(200);
            expect(ACC_RESPONSE.status()).toBe(200)
          })
          await test.step('Check we landed on the dashboard', async()=>{
            await expect(page).toHaveURL(/.*dashboard/)
            await page.waitForTimeout(300);//emulate user behavior
            await expect(uISideMenu.qubikaBrandIcon).toBeVisible();
            await page.waitForTimeout(300);//emulate user behavior
          });
      });
        await test.step('Get to categories', async()=>{
          await uISideMenu.clickCategoriesTypes();
          await expect(uICategories.categoriesTypesHeader).toBeVisible();
        })
        await test.step('Cancel creating a category', async()=>{
          await test.step('click Add a Category', async()=>{
            await uICategories.clickAddCategory();
            await expect(uICategories.addCategoryTypeHeader).toBeVisible();
          });
          await test.step('Fill a Name category', async()=>{
            await uICategories.fillNameCategory(nameCategory)
            await expect(uICategories.nameCategory).toHaveValue(nameCategory)
          });
          await test.step('Try saving the category', async()=>{
            await uICategories.clickCancelCreatingACategory()
            await expect(uICategories.addCategoryModal).toBeHidden();
            await expect(uICategories.categoryTypeAddedPopUP).toBeHidden();  
          });
        })
        await test.step('Create a category page', async()=>{
          await test.step('Click Add a Category', async()=>{
            await uICategories.clickAddCategory();
            await expect(uICategories.addCategoryTypeHeader).toBeVisible();
          });
          await test.step('Fill a Name category', async()=>{
            await uICategories.fillNameCategory(nameCategory)
            await expect(uICategories.nameCategory).toHaveValue(nameCategory);  
          });
          await test.step('Save the category', async()=>{
            await uICategories.clickAcceptCategory()
            await expect(uICategories.addCategoryModal).toBeHidden();
            await expect(uICategories.categoryTypeAddedPopUP).toBeVisible();  
            
          });
  
        })
        await test.step('Create a sub category page', async()=>{
          await test.step('Click Add a Category', async()=>{
            await uICategories.clickAddCategory();
            await expect(uICategories.addCategoryTypeHeader).toBeVisible();
          });
          await test.step('Fill a Name category', async()=>{
            await uICategories.fillNameCategory(nameCategory)
            await expect(uICategories.nameCategory).toHaveValue(nameCategory);  
          });
          await test.step('Click on the subcategory option', async()=>{
            await uICategories.clickIsItASubcategoryButton()
            await expect(uICategories.subcategoryRadioInput).toHaveCSS('background-color',colorBackGroundToExpect)
          });
          await test.step('Select the father category', async()=>{
            await uICategories.clickSelectFatherCategory()
            await uICategories.clickOnFirstCategoryOption();//Here we will be clicking on the first category as there is no option in the app to look for the one recently created
          });
          await test.step('Save the category', async()=>{
            await uICategories.clickAcceptCategory()
            await expect(uICategories.addCategoryModal).toBeHidden();
            await expect(uICategories.categoryTypeAddedPopUP).toBeVisible();  
          });
          

        })

      })


    // })
  });