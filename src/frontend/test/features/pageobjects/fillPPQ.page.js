const Page = require('./page');
const link = "//a[contains(text(),'";
const randomLink = "(//label[contains(text(),'')])[";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class fillPPQ extends Page {
  /**
   * define selectors using getter methods
   */
  get datePicker() {
    return $('//input[@placeholder="yyyy/mm/dd"]');
  }

  get selectDate() {
    return $("//div[contains(text(),'10')]");
  }

  get textArea() {
    return $('//textarea');
  }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */

  async selectCheckbox(checkName) {
    const h1 = link + checkName + "')]/../input";
    const headerElement = await $(h1);
    await headerElement.waitForDisplayed();
  }

  async clickCheckbox() {
    function getRandomNumber() {
      // Generate a random number between min (inclusive) and max (inclusive)
      return Math.floor(Math.random() * (13 - 3 + 1) + 3);
    }
    var random = getRandomNumber();
    console.log('Random number is : ' + random);
    for (var i = 3; i <= random; i++) {
      var newlink = randomLink + i + ']/../label/input';
      const buttonElement = await $(newlink);
      await buttonElement.waitForClickable();
      await buttonElement.click();
    }
  }

  async selectData() {
    await this.datePicker.waitForClickable();
    await this.datePicker.click();
    await this.selectDate.waitForClickable();
    await this.selectDate.click();
  }

  async AddText() {
    await this.textArea.waitForExist();
    await this.textArea.setValue(
      'Is there anything else the CPO should consider when reviewing this PIA? PIA?123#$%',
    );
  }

  /**
   * overwrite specific options to adapt it to page object
   */
  open() {
    return super.open('fillPPQ');
  }
}

module.exports = new fillPPQ();
