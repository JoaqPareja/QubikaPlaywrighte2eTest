import {  Page, request } from '@playwright/test';

export default class APILogin{
    readonly request:typeof request 
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.request = request;
    }
    public async logToTheWebSite(userEmail:string,userPassword:string){
        const context = await request.newContext();
          const TR_BODY_RESPONSE_PROMISE=
          await context.post(`${process.env.API_URL}/auth/login`,
            { data:{
                email: userEmail, password: userPassword
        }
    })
    await this.page.waitForTimeout(300);
    return TR_BODY_RESPONSE_PROMISE;
    }
    public async getUserAccountInformation(ID_TOKEN:string){
        const context = await request.newContext();
          const TR_BODY_RESPONSE_PROMISE=
          await context.get(`${process.env.API_URL}/user/account`,
             { headers: {
                'Authorization': `Bearer ${ID_TOKEN}`,
            }
        })
    
    await this.page.waitForTimeout(300);
    return TR_BODY_RESPONSE_PROMISE;
    }
    
}