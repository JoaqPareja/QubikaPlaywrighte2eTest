import { expect, type Locator, type Page } from '@playwright/test';


export default class UISideMenu{
    public readonly qubikaBrandIcon: Locator;
    public readonly categoriesTypes: Locator;

    constructor(private page:Page){
        this.page=page;
        this.qubikaBrandIcon=this.page.locator('.navbar-brand');
        this.categoriesTypes= this.page.getByRole('link', { name: ' Tipos de Categorias' });
 
        //Cancelar

    }
    public async clickCategoriesTypes(){
        await this.page.waitForTimeout(500);//emulate user behavior 
        await this.categoriesTypes.click();
        await this.page.waitForTimeout(500);//emulate user behavior 
    } 

}