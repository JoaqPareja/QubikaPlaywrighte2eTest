import {  Page, request } from '@playwright/test';

export default class APIRegister{
    readonly request:typeof request 
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
        this.request = request;
    }
    public async registerUSer(userEmail:string,userPassword:string){
        const context = await request.newContext();
          const TR_BODY_RESPONSE_PROMISE=
          await context.post(`${process.env.API_URL}/auth/register`,
            { data:{
                email: userEmail, password: userPassword,
                roles: ["ROLE_ADMIN"]
        }
    })
    await this.page.waitForTimeout(300);
    return TR_BODY_RESPONSE_PROMISE;
    }
}