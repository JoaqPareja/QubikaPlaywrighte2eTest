import {  Page, request } from '@playwright/test';

export default class APILogin{
    readonly request:typeof request // no error
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.request = request;
    }
    public async logToTheWebSite  (userEmail:string,userPassword:string){
        // console.log(amountValue)
        // console.log(Number(amountValue))
        await this.page.waitForTimeout(500)
        const context = await request.newContext();
          const TR_BODY_RESPONSE_PROMISE=
          await context.post(`${process.env.API_URL}/auth/login`,
            { data:{
                email: userEmail, password: userPassword
        }
    })
    return TR_BODY_RESPONSE_PROMISE;

}
    
}