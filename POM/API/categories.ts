import {Page, request } from '@playwright/test';

export default class APICategories{
    readonly request:typeof request 
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.request = request;
    }

    public async getCategories(ID_TOKEN:string){
        const context = await request.newContext();
          const TR_BODY_RESPONSE_PROMISE=
          await context.get(`${process.env.API_URL}/category-type/filter?offset=0&page=undefined&size=9`,
             { headers: {
                'Authorization': `Bearer ${ID_TOKEN}`,
            }
        })
    
    await this.page.waitForTimeout(300);
    return TR_BODY_RESPONSE_PROMISE;
    }
    public async createACategory(ID_TOKEN:string,categoryName:string,getParentId:string|null
    ){
        const context = await request.newContext();
          const TR_BODY_RESPONSE_PROMISE=
          await context.post(`${process.env.API_URL}/category-type/create`,
             { headers: {
                'Authorization': `Bearer ${ID_TOKEN}`}  ,
             data:{
                name: categoryName, root: true, parentId: getParentId
            }
        })
    
    await this.page.waitForTimeout(300);
    return TR_BODY_RESPONSE_PROMISE;
    }
    public async getCategoryByID(ID_TOKEN:string,categoryID:string
    ){
        const context = await request.newContext();
        const TR_BODY_RESPONSE_PROMISE=
        await context.get(`${process.env.API_URL}/category-type/${categoryID}`,
           { headers: {
              'Authorization': `Bearer ${ID_TOKEN}`}
      })
  
  await this.page.waitForTimeout(300);
  return TR_BODY_RESPONSE_PROMISE;
    }

    // 
//https://api.club-administration.qa.qubika.com/api
   
}