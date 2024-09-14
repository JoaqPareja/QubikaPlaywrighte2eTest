import { devices } from '@playwright/test';
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.envInformation\dot.env
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';dot.env
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */


// process.env.BASE_URL='https://club-administration.qa.qubika.com/#/auth/login'
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {    
    // baseURL:process.env.baseURL,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */

  projects: [
    {
      name: 'chromium',
      use: {
        actionTimeout: process.env.CI?240000: 180000,
        navigationTimeout: process.env.CI?240000: 180000,
        expect: process.env.CI ?240000: 180000,
        // trace: 'on',
        video: {
          recordVideo: { dir: 'videos/' }, 
          mode: 'on',
          size: { width: 1920, height: 1080 }},
        baseURL:process.env.BASE_URL,

        ...devices['Desktop Chrome'],
        viewport: {  width: 1920, height: 1080} 
        // Use prepared auth state.
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
