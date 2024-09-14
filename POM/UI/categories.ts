import { expect, type Locator, type Page } from '@playwright/test';


export default class UICategories{
    public readonly categoriesTypesHeader: Locator;
    public readonly addCategoryButton:Locator;
    public readonly addCategoryTypeHeader: Locator;
    public readonly nameCategory: Locator;
    public readonly acceptButtonCategory: Locator;
    public readonly cancelButtonCategory: Locator;
    public readonly categoryTypeAddedPopUP: Locator;
    public readonly addCategoryModal: Locator;
    public readonly isItASubcategoryButton: Locator;
    public readonly subcategoryRadioInput: Locator;
    public readonly selectFatherCategory:Locator;
    public readonly firstCategoryOption: Locator;
    constructor(private page:Page){
        this.page=page;
        this.categoriesTypesHeader=this.page.getByRole('heading', { name: 'Tipos de categorías' });
        this.addCategoryButton = this.page.getByRole('button', { name: ' Adicionar' });
        this.addCategoryTypeHeader=this.page.getByRole('heading', { name: 'Adicionar tipo de categoría' });
        this.nameCategory=this.page.getByPlaceholder('Nombre de categoría');
        this.acceptButtonCategory=this.page.getByRole('button', { name: 'Aceptar' });
        this.cancelButtonCategory=this.page.getByRole('button', { name: 'Cancelar' });
        this.categoryTypeAddedPopUP= this.page.getByLabel('Tipo de categoría adicionada');
        this.addCategoryModal=this.page.getByLabel('Adicionar tipo de categoría')
        this.isItASubcategoryButton=this.page.locator('label').filter({ hasText: 'Es subcategoria?' });
        this.subcategoryRadioInput= this.page.locator('#customCheckMain');
        this.selectFatherCategory= this.page.locator('div').filter({ hasText: /^Seleccione la categoría padre$/ }).nth(2);
        this.firstCategoryOption=this.page.getByRole('option').first()
    }

    public async clickAddCategory(){
        await this.page.waitForTimeout(500);//emulate user behavior 
        await this.addCategoryButton.click();
        await this.page.waitForTimeout(500);//emulate user behavior 
    }
    public async fillNameCategory(nameCategory:string){
        await this.page.waitForTimeout(500);//emulate user behavior 
        await this.nameCategory.click();
        await this.nameCategory.fill(nameCategory);
    }
    public async clickAcceptCategory(){
        await this.page.waitForTimeout(500);//emulate user behavior 
        await this.acceptButtonCategory.click();
        await this.page.waitForTimeout(500);//emulate user behavior 
    }
    public async clickCancelCreatingACategory(){
        await this.page.waitForTimeout(500);//emulate user behavior 
        await this.cancelButtonCategory.click();
        await this.page.waitForTimeout(500);//emulate user behavior 
    }
    public async clickIsItASubcategoryButton(){
        await this.page.waitForTimeout(500);//emulate user behavior 
        await this.isItASubcategoryButton.click()
    }
    public async clickSelectFatherCategory(){
        await this.page.waitForTimeout(500);//emulate user behavior 
        await this.selectFatherCategory.click();

    }
    public async clickOnFirstCategoryOption(){
        await this.page.waitForTimeout(500);//emulate user behavior 
        await this.firstCategoryOption.click();
    }
}