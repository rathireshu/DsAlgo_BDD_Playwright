import {expect} from '@playwright/test'
import{readExcelCode, readExcelResult } from '../../CommonUtils/ExcelUtility'

 class GenericPage{
    constructor(page){
        this.page = page
        this.page.tryHere = page.locator("//a[text()='Try here>>>']")
        this.page.editorInput = page.locator('pre').nth(1)
        //this.page.editorInput = page.locator("//pre[@class=' CodeMirror-line ']")
        this.page.editorText = page.getByRole('textbox')
        this.page.run = page.getByRole('button', { name: 'Run' })
        this.page.output = page.locator("//pre[@id='output']")
        
    }

	async click_Tryhere() {
		await tryHere.click();
	}

	async navigateTotryEditor(page) {
		await page.goto(process.env.tryEditorUrl); 
	}
	
	async  click_Run() {
		await this.page.run.click();
	}

  
  async verifyAlertErrMsgNClikeOkBtn(errMsg) {
    //first enable alert handling and then click btn to get alert
    await this.page.on('dialog',async dialog=>{

        expect(dialog.type()).toContain('alert')
        //expect(dialog.message()).toContain(errMsg)
        expect(dialog.message()).toContain('NameError: name')
        await dialog.accept();
    })
 }

 async enterCodeWithoutExcel(input) {
  await this.page.editorInput.fill(input)
  await this.page.pause()
}	
  
	async enterCodeToExecute( sheetName,  rowNum, page)
    {
		let code = await readExcelCode(sheetName,rowNum, page )
      
        await this.page.editorInput.click();

            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('a');
            await this.page.keyboard.press('Backspace');
            await this.page.keyboard.up('Control');
          
            const str1 = code.split("\n");
            for (let i = 0; i < str1.length; i++) {
              if (str1[i].trim() === "\\b") {
                await this.page.editorInput.press('Backspace');
              } else {
                await this.page.editorInput.type(str1[i]);
                await this.page.editorInput.press('Enter');
              }
            }

            
        this.page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => {});
        });
	}
      
	async getExpectedResult(sheetName,  rowNum) {
        console.log('Result row and sheet', sheetName, rowNum)
		let expectedResult = await readExcelResult(sheetName,rowNum )
        
        console.log('expectedResult ', expectedResult)
		return expectedResult;
	}

	async  getErrorMessage(arg) {
    this.page.on('dialog', async dialog => {
      // Extract the dialog message
      const dialogMessage = dialog.message();
  
      // Print or handle the dialog message as needed
      console.log('Dialog message:', dialogMessage);
      console.log('expected result ', arg)
      // Dismiss the dialog (You can also accept it using dialog.accept())
      await dialog.dismiss();
	})}

	async getActualResult() {
		 return await this.page.output.innerText
	}
	
	async reusableMethod(string) {
		// page_name = string.replaceAll("\\s+", "");
		// urlName = ConfigReader.getUrl(page_name);
		// driver.get(urlName);
	}
}


export{GenericPage}
