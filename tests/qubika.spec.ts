import { expect } from '@playwright/test';
import { test } from '../customTypes/user';
import UILogin from "../POM/UI/login"
import UISideMenu from "../POM/UI/sideMenu"
import UICategories from "../POM/UI/categories"

test.use({video: 'on'});
  test.setTimeout(140000);

    test('Qubika test', async ({ page,email,password, emailNotRegistered,passwordNotRegistered,nameCategory}) => {
      const uILogin = new UILogin(page)
      const uISideMenu =new UISideMenu(page)
      const uICategories =new UICategories(page)
      await test.step('API test', async ()=>{
      })
      await test.step('UI test', async ()=>{
        await test.step('get to the Log in page and check that we landed in the right page', async ()=>{
          await page.goto('/');
          await expect(page).toHaveURL(/.*club-administration.qa.qubika.com/)
          await expect(page).toHaveURL(/.login/)
          await page.waitForTimeout(300);
        })
        await test.step('Type incorrect email and password', async()=>{
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
            const rememberMe = page.locator('div').filter({ hasText: /^Recordarme$/ })
            await rememberMe.click();
            const inputRadio= page.locator('.custom-control-input');
            await expect(inputRadio).toHaveCSS('background-color',"rgba(0, 0, 0, 0)")
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
            await page.locator('label').filter({ hasText: 'Es subcategoria?' }).click();
            const subcategoryRadioInput= page.locator('#customCheckMain')
            await expect(subcategoryRadioInput).toHaveCSS('background-color',"rgba(0, 0, 0, 0)")
          });
          await test.step('Select the father category', async()=>{
            await page.locator('div').filter({ hasText: /^Seleccione la categoría padre$/ }).nth(2).click();
            await page.getByRole('option').first().click();//Explicar porque se elige el primer input no mas 
          });
          await test.step('save the category', async()=>{
            await uICategories.clickAcceptCategory()
            await expect(uICategories.addCategoryModal).toBeHidden();
            await expect(uICategories.categoryTypeAddedPopUP).toBeVisible();  
          });
          

        })

        await page.pause()


      //   await test.step('Check that we landed on the Log in page', async ()=>{
      //  })
      })


    // })
  });