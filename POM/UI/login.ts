import { expect, type Locator, type Page } from '@playwright/test';


export default class UILogin{
    public readonly userEmailLocator:Locator
    public readonly userPasswordLocator: Locator;
    public readonly popUpWrongUsernameOrPasswrod: Locator;
    public readonly authenticateButton: Locator;
    public readonly qubikaBrandIcon: Locator;
    public readonly rememberMe: Locator;
    public readonly inputRadio: Locator;
    constructor(private page:Page){
        this.page = page;
        this.userEmailLocator=this.page.getByPlaceholder('Usuario o correo electrónico');
        this.userPasswordLocator=this.page.getByPlaceholder('Contraseña');
        this.popUpWrongUsernameOrPasswrod= this.page.getByLabel('Usuario o contraseña incorrectos');
        this.authenticateButton=this.page.getByRole('button', { name: 'Autenticar' });
        this.rememberMe = this.page.locator('div').filter({ hasText: /^Recordarme$/ })
        this.inputRadio= this.page.locator('.custom-control-input');

    }
    public async fillUserName(email:string){
        await this.userEmailLocator.click();
        await this.userEmailLocator.fill(email)
        await this.page.waitForLoadState('load')
        await this.page.waitForTimeout(1000);//emulate user behavior 
    }
    public async jumpToPasswordFromUserName(){
        await this.userEmailLocator.press('Tab')
        await this.page.waitForTimeout(1000);//emulate user behavior 
    }
    public async fillUserPassword(password:string){
        await this.userPasswordLocator.click();
        await this.userPasswordLocator.fill(password)
        await this.page.waitForLoadState('load')
        await this.page.waitForTimeout(1000);//emulate user behavior 
    }
    private async authLogin(){
        const authResponsePromise =  await this.page.waitForResponse(/.*login$/);
        const AUTH_RESPONSE =  authResponsePromise
        return AUTH_RESPONSE;
    }
    private async checkAccountResponse(){
        const authResponsePromise =  await this.page.waitForResponse(/.*account$/);
        const AUTH_RESPONSE =  authResponsePromise
        return AUTH_RESPONSE;
    }
    public async clickOnAuthenticateButton(){
        await this.authenticateButton.click();
        await this.page.waitForLoadState('load')
        await this.page.waitForTimeout(1000);//emulate user behavior 
    }
    public async clickOnAuthenticateButtonAndCheckAPINetworkResponses(){
        await this.page.waitForTimeout(1000);//emulate user behavior 
        await this.authenticateButton.click({force:true});
        await this.page.waitForLoadState('load')
        const AUTH_RESPONSE = await this.authLogin();
        const ACC_RESPONSE= await this.checkAccountResponse();
        expect(AUTH_RESPONSE.status()).toBe(200);
        expect(ACC_RESPONSE.status()).toBe(200)
    }
     public async clickOnRembemberMe(){
        await this.page.waitForTimeout(1000);//emulate user behavior 
        await this.rememberMe.click();
     }

}