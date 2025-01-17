const Page = require('./page');
const header = "//h1[contains(text(),'";
let baseURL='';


/**
 * sub page containing specific selectors and methods for a specific page
 */
class authPage extends Page {
    /**
     * define selectors using getter methods
     */
    get head () {
        return $("//h1[contains(text(),'Digital Privacy Impact Assessment (DPIA)')]");
    }
    get headlanding () {
        return $("//b[contains(text(),'Digital Privacy Impact Assessment (DPIA) ')]");
    }
    get loginButton1 () {
        return $("//button/div[contains(text(),'Log in with IDIR')]");
    }
    get loginButton2 () {
        return $("//button[contains(text(),'Log in with IDIR')]");
    }
    

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */


    async openSameBrowser () {
        if(browser.options.baseUrl?.includes('test'))
        {
          baseURL = 'https://test.pia.gov.bc.ca/';
        }
        else if(browser.options.baseUrl?.includes('dev'))
        {
          baseURL = 'https://dev.pia.gov.bc.ca/';
        }
        else if(browser.options.baseUrl?.includes('local'))
        {
          baseURL = 'http://localhost:8080/';
        }
        else
        {
          await expect("URL not equal to dev,test or local").toEqual("URL should be dev,test or local");
        }
        console.log("URL is: "+baseURL)
        await browser.url(baseURL);
    }

    async openNewBrowser () {
        if(browser.options.baseUrl?.includes('test'))
        {
          baseURL = 'https://test.pia.gov.bc.ca/';
        }
        else if(browser.options.baseUrl?.includes('dev'))
        {
          baseURL = 'https://dev.pia.gov.bc.ca/';
        }
        else if(browser.options.baseUrl?.includes('local'))
        {
          baseURL = 'http://localhost:8080/';
        }
        else
        {
          await expect("URL not equal to dev,test or local").toEqual("URL should be dev,test or local");
        }
        console.log("URL is: "+baseURL)
        await browser.newWindow(baseURL);
        const handles = await browser.getWindowHandles()
        await browser.switchToWindow(handles[1])
    }
    
    async authError (error) {
        const h1=header + error + "')]";
        const headerElement=await $(h1);
        await headerElement.waitForDisplayed();
    }
    
    /**
     * overwrite specific options to adapt it to page object
     */
    open () {
        return super.open('authenticated');
    }
}

module.exports = new authPage();
