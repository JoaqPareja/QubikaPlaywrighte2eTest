import { test as base } from '@playwright/test';

export type TestOptions = {
  email: string;
  password:string;
  emailNotRegistered:string;
  passwordNotRegistered:string;
  nameCategory:string;
  colorBackGroundToExpect:string;
};
export const test = base.extend<TestOptions>({
  // Define an option and provide a default value.
  // We can later override it in the config.
  email: [`${process.env.USER_EMAIL}`, { option: true }],
  password:[`${process.env.USER_PASSWROD}`, { option: true }],
  emailNotRegistered:[`${process.env.EMAIL_NOT_REGISTERED}`, { option: true }],
  passwordNotRegistered:[`${process.env.PASSWORD_NOT_REGISTERED}`, { option: true }],
  nameCategory:[`${process.env.NAME_CATEGORY}`, { option: true }],
  colorBackGroundToExpect:"rgba(0, 0, 0, 0)"
});