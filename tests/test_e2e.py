import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import logging
import subprocess
import os
import csv

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='selenium_test_v1.log',  # Output to file
    filemode='w'  # Overwrite file each run
)

logger = logging.getLogger('selenium_tests')


class SingupTest:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.base_url = 'https://ai-meeting-notes-ebon.vercel.app/signup'
        self.credentials = self.read_data_from_csv('test_data/registerData.csv')
        self.wait = WebDriverWait(self.driver, 10)

    def read_data_from_csv(self, filename):
        # create an empty list
        datalist = []

        # open csv file
        csvdata = open(filename, "r")

        # create csv reader
        reader = csv.reader(csvdata)
        
        #skip header 
        next(reader)

        # add csv rows to list
        for rows in reader:
            datalist.append(rows)
        return datalist
    
    def run_webpage(self, base_url):
        self.driver.get(base_url)
        logger.info(f"Going to Webpage {base_url}")

    def sign_up_credentials(self, username, email, password, confirmPassword, testNumber):
        self.run_webpage(self.base_url)

        # locators
        usernameField = self.wait.until( EC.presence_of_element_located((By.ID, 'username')))
        usernameField.clear()
        logger.info('Clearing the Username Field')
        usernameField.send_keys(username)
        logger.info(f'Sending Keys {username} to Username Field')

        emailField = self.wait.until( EC.presence_of_element_located((By.ID, 'email')))
        emailField.clear()
        logger.info('Clearing the Email Field')
        emailField.send_keys(email)
        logger.info(f'Sending Keys {email} to Email Field')

        passwordField = self.wait.until( EC.presence_of_element_located((By.ID, "password")))      
        passwordField.clear()
        logger.info('Clearing the Password Field')
        passwordField.send_keys(password)
        logger.info(f'Sending Keys {password} to Password Field')

        confirmPasswordField = self.wait.until( EC.presence_of_element_located((By.ID, "confirmPassword")))      
        confirmPasswordField.clear()
        logger.info('Clearing the Password Field')
        confirmPasswordField.send_keys(confirmPassword)
        logger.info(f'Sending Keys {confirmPassword} to Password Field')

        signupButton = self.wait.until( EC.presence_of_element_located((By.CLASS_NAME, 'sign-up')))
        signupButton.click()
        logger.info('Clicked Signup Button')

        time.sleep(2)

        result = self.checkSuccess(testNumber)
        return result
    
    def checkSuccess(self, testNumber):
        version = self.get_latest_git_tag()

        screenshot_folder = os.path.join('screenshots', version)
        os.makedirs(screenshot_folder, exist_ok=True)

        try:
            toastElement = self.wait.until( EC.presence_of_element_located((By.CLASS_NAME, 'Toastify__toast')))
            
            if 'success' in toastElement.get_attribute('class'):
                logger.info('Signup was Successful')
                screenshot_name = f'signup-success-{testNumber}.png'
                result = "SUCCESS"
            else:
                logger.error('Signup was Unsuccessful')
                screenshot_name = f'signup-failed-{testNumber}.png'
                result = "FAILED"

            # full path to save screenshot
            screenshot_path = os.path.join(screenshot_folder, screenshot_name)
            self.driver.save_screenshot(screenshot_path)
            logger.info(f'Screenshot saved as: {screenshot_path}')

            # log the toast message content
            toastText = toastElement.text
            logger.info(f'Toast message: {toastText}')

            return result
        
        except Exception as e:
            logger.error(f'Error checking login result: {str(e)}')
            screenshot_name = f'login-error-{testNumber}.png'
            self.driver.save_screenshot(screenshot_name)
            return "ERROR"
    
    def runAllTests(self, credentials):
        """Run all login tests"""
        test_results = {}
        
        try:
            count = 1
            for username, email, password, confirmPassword, *_ in credentials:
                test_results[count] = self.sign_up_credentials(username, email, password, confirmPassword, count)
                count += 1
            # Summary
            logger.info('=== TEST SUMMARY ===')
            for test_name, result in test_results.items():
                logger.info(f'{test_name}: {result}')
                
        except Exception as e:
            logger.error(f'Error during test execution: {str(e)}')
        finally:
            self.cleanup()
            
        return test_results
    
    def cleanup(self):
        """Close the browser"""
        if self.driver:
            self.driver.quit()
            logger.info('Browser closed')
    @staticmethod

    def get_latest_git_tag():
        try:
            return subprocess.check_output(['git', 'describe', '--tags', '--abbrev=0']).decode('utf-8').strip()
        except Exception:
            return "v0.0.0"
        
if __name__ == "__main__":
    test_runner = SingupTest()
    results = test_runner.runAllTests(test_runner.credentials)
