import { expect } from '@playwright/test';
import { test } from '../customTypes/testData';
import UILogin from "../POM/UI/login"
import UISideMenu from "../POM/UI/sideMenu"
import UICategories from "../POM/UI/categories"
import APILogin from "../POM/API/login"
import APICategories from "../POM/API/categories"

test.use({video: 'on'});
  test.setTimeout(140000);

    test('Qubika test', async ({ page,email,userName,password, emailNotRegistered,passwordNotRegistered,nameCategory,colorBackGroundToExpect}) => {
      const uILogin = new UILogin(page)
      const uISideMenu =new UISideMenu(page)
      const uICategories =new UICategories(page);
      const aPILogin= new APILogin(page)
      const aPICategories= new APICategories(page)
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
          await test.step('delete sub Category', async ()=>{
           const deleteSubCategory= await aPICategories.deleteCategory(`${process.env.ID_TOKEN}`,`${process.env.SUB_CATEGORY_ID_FROM_API}`)
           expect(deleteSubCategory.ok()).toBeTruthy();
           expect(deleteSubCategory.status()).toBe(200);
           await test.step('check that the sub Category no longer exist', async ()=>{
              const getCategoryByIDReponse=await aPICategories.getCategoryByID(`${process.env.ID_TOKEN}`,`${process.env.SUB_CATEGORY_ID_FROM_API}`)
              expect(getCategoryByIDReponse.status()).toBe(404);
            });
            await test.step('Check that although the sub category has been deleted in the previous step we still have the father category', async ()=>{
              const getCategoryByIDReponse=await aPICategories.getCategoryByID(`${process.env.ID_TOKEN}`,`${process.env.FATHER_CATEGORY_ID_FROM_API}`)
              expect(getCategoryByIDReponse.ok()).toBeTruthy();
              expect(getCategoryByIDReponse.status()).toBe(200);
            })
          });
          await test.step('delete Category', async ()=>{
            const deleteFatherCategory= await aPICategories.deleteCategory(`${process.env.ID_TOKEN}`,`${process.env.FATHER_CATEGORY_ID_FROM_API}`)
            expect(deleteFatherCategory.ok()).toBeTruthy();
            expect(deleteFatherCategory.status()).toBe(200);
            await test.step('check the Category no longer exist', async ()=>{
              const getCategoryByIDReponse=await aPICategories.getCategoryByID(`${process.env.ID_TOKEN}`,`${process.env.FATHER_CATEGORY_ID_FROM_API}`)
              expect(getCategoryByIDReponse.status()).toBe(404);
            });
            await page.pause()
          });

        });
        
      })
      await test.step('UI test', async ()=>{
        await test.step('get to the Log in page and check that we landed in the right page', async ()=>{
          await page.goto('/');
          await expect(page).toHaveURL(/.*club-administration.qa.qubika.com/)
          await expect(page).toHaveURL(/.login/)
          await page.waitForTimeout(300);
        })
        await test.step('Check message for an incorrect email and password', async()=>{
          await test.step('type Incorrectly user email', async ()=>{
            await uILogin.fillUserName(emailNotRegistered)
            await uILogin.jumpToPasswordFromUserName();
          })
          await test.step('type user password', async ()=>{
            await uILogin.fillUserPassword(passwordNotRegistered)
          })
          await test.step('Click on the authenticate button', async()=>{
            await uILogin.clickOnAuthenticateButton();
          })
          await test.step('Verify that the pop up for wrong user name or password appear on the screen',async ()=>{
            await expect(uILogin.popUpWrongUsernameOrPasswrod).toBeVisible();
          })
        })
        await test.step('Type correct credentials', async()=>{
          await test.step('type user email', async ()=>{
            await uILogin.fillUserName(email)
            await expect(uILogin.userEmailLocator).toHaveValue(email) // Why toHaveValue instead of toHaveText ? because the input saves it as value and not as as text
            await uILogin.jumpToPasswordFromUserName();
          })
          await test.step('type user password', async ()=>{
            await uILogin.fillUserPassword(password)
            await expect(uILogin.userPasswordLocator).toHaveValue(password)
          })
          await test.step('Remember me step',async()=>{
            await uILogin.clickOnRembemberMe();
            await uILogin.clickOnRembemberMe();
            await expect(uILogin.inputRadio).toHaveCSS('background-color',colorBackGroundToExpect)
          })
          await test.step('Click on the authenticate button', async()=>{
            await uILogin.clickOnAuthenticateButtonAndCheckAPINetworkResponses();
          })
          await test.step('Check we landed on the dashboard', async()=>{
            await expect(page).toHaveURL(/.*dashboard/)
            await page.waitForTimeout(300);//emulate user behavior
            await expect(uISideMenu.qubikaBrandIcon).toBeVisible();
            await page.waitForTimeout(300);//emulate user behavior
          });
      });
        await test.step('get to categories', async()=>{
          await uISideMenu.clickCategoriesTypes();
          await expect(uICategories.categoriesTypesHeader).toBeVisible();
        })
        await test.step('cancel creating a category', async()=>{
          await test.step('click Add a Category', async()=>{
            await uICategories.clickAddCategory();
            await expect(uICategories.addCategoryTypeHeader).toBeVisible();
          });
          await test.step('fill a Name category', async()=>{
            await uICategories.fillNameCategory(nameCategory)
            await expect(uICategories.nameCategory).toHaveValue(nameCategory)
          });
          await test.step('Try saving the category', async()=>{
            await uICategories.clickCancelCreatingACategory()
            await expect(uICategories.addCategoryModal).toBeHidden();
            await expect(uICategories.categoryTypeAddedPopUP).toBeHidden();  
          });
        })
        await test.step('create a category page', async()=>{
          await test.step('click Add a Category', async()=>{
            await uICategories.clickAddCategory();
            await expect(uICategories.addCategoryTypeHeader).toBeVisible();
          });
          await test.step('fill a Name category', async()=>{
            await uICategories.fillNameCategory(nameCategory)
            await expect(uICategories.nameCategory).toHaveValue(nameCategory);  
          });
          await test.step('save the category', async()=>{
            await uICategories.clickAcceptCategory()
            await expect(uICategories.addCategoryModal).toBeHidden();
            await expect(uICategories.categoryTypeAddedPopUP).toBeVisible();  
            
          });
  
        })
        await test.step('create a sub category page', async()=>{
          await test.step('click Add a Category', async()=>{
            await uICategories.clickAddCategory();
            await expect(uICategories.addCategoryTypeHeader).toBeVisible();
          });
          await test.step('fill a Name category', async()=>{
            await uICategories.fillNameCategory(nameCategory)
            await expect(uICategories.nameCategory).toHaveValue(nameCategory);  
          });
          await test.step('click on the subcategory option', async()=>{
            await uICategories.clickIsItASubcategoryButton()
            await expect(uICategories.subcategoryRadioInput).toHaveCSS('background-color',colorBackGroundToExpect)
          });
          await test.step('Select the father category', async()=>{
            await uICategories.clickSelectFatherCategory()
            await uICategories.clickOnFirstCategoryOption();//Here we will be clicking on the first category as there is no option in the app to look for the one recently created
          });
          await test.step('save the category', async()=>{
            await uICategories.clickAcceptCategory()
            await expect(uICategories.addCategoryModal).toBeHidden();
            await expect(uICategories.categoryTypeAddedPopUP).toBeVisible();  
          });
          

        })

      })


    // })
  });