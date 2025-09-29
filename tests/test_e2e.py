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
    filename='selenium_test_v1.log',
    filemode='w'
)

logger = logging.getLogger('selenium_tests')


class SignupTest:
    def __init__(self, browser='chrome'):
        self.browser = browser
        self.driver = self.get_driver(browser)
        self.base_url = 'https://ai-meeting-notes-ebon.vercel.app/signup'
        self.credentials = self.read_data_from_csv('test_data/registerData.csv')
        self.wait = WebDriverWait(self.driver, 10)
        logger.info(f'Initialized {browser.upper()} browser for testing')

    def get_driver(self, browser):
        try:
            if browser.lower() == 'chrome':
                return webdriver.Chrome()
            elif browser.lower() == 'firefox':
                return webdriver.Firefox()
            elif browser.lower() == 'edge':
                return webdriver.Edge()
            else:
                raise ValueError(f"Unsupported browser: {browser}")
        except Exception as e:
            logger.error(f'Failed to initialize {browser} driver: {str(e)}')
            raise

    def read_data_from_csv(self, filename):
        """Read test data from CSV file"""
        datalist = []
        
        try:
            csvdata = open(filename, "r")
            reader = csv.reader(csvdata)
            next(reader)  # Skip header
            
            for rows in reader:
                datalist.append(rows)
            
            logger.info(f'Loaded {len(datalist)} test cases from {filename}')
            return datalist
        except Exception as e:
            logger.error(f'Error reading CSV file: {str(e)}')
            raise
    
    def run_webpage(self, base_url):
        """Navigate to the webpage"""
        self.driver.get(base_url)
        logger.info(f'[{self.browser}] Going to Webpage {base_url}')

    def sign_up_credentials(self, username, email, password, confirmPassword, testNumber):
        self.run_webpage(self.base_url)

        try:
            # Username field
            usernameField = self.wait.until(EC.presence_of_element_located((By.ID, 'username')))
            usernameField.clear()
            logger.info(f'[{self.browser}] Clearing the Username Field')
            usernameField.send_keys(username)
            logger.info(f'[{self.browser}] Sending Keys "{username}" to Username Field')

            # Email field
            emailField = self.wait.until(EC.presence_of_element_located((By.ID, 'email')))
            emailField.clear()
            logger.info(f'[{self.browser}] Clearing the Email Field')
            emailField.send_keys(email)
            logger.info(f'[{self.browser}] Sending Keys "{email}" to Email Field')

            # Password field
            passwordField = self.wait.until(EC.presence_of_element_located((By.ID, "password")))
            passwordField.clear()
            logger.info(f'[{self.browser}] Clearing the Password Field')
            passwordField.send_keys(password)
            logger.info(f'[{self.browser}] Sending Keys to Password Field')

            # Confirm password field
            confirmPasswordField = self.wait.until(EC.presence_of_element_located((By.ID, "confirmPassword")))
            confirmPasswordField.clear()
            logger.info(f'[{self.browser}] Clearing the Confirm Password Field')
            confirmPasswordField.send_keys(confirmPassword)
            logger.info(f'[{self.browser}] Sending Keys to Confirm Password Field')

            # Click signup button
            signupButton = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'sign-up')))
            signupButton.click()
            logger.info(f'[{self.browser}] Clicked Signup Button')

            time.sleep(2)

            result = self.checkSuccess(testNumber)
            return result
        
        except Exception as e:
            logger.error(f'[{self.browser}] Error during signup process: {str(e)}')
            return "ERROR"
    
    def checkSuccess(self, testNumber):
        version = self.get_latest_git_tag()

        # Create browser-specific screenshot folder
        screenshot_folder = os.path.join('screenshots', version, self.browser)
        os.makedirs(screenshot_folder, exist_ok=True)

        try:
            toastElement = self.wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'Toastify__toast')))
            
            if 'success' in toastElement.get_attribute('class'):
                logger.info(f'[{self.browser}] Signup was Successful')
                screenshot_name = f'signup-success-test{testNumber}.png'
                result = "SUCCESS"
            else:
                logger.error(f'[{self.browser}] Signup was Unsuccessful')
                screenshot_name = f'signup-failed-test{testNumber}.png'
                result = "FAILED"

            # Save screenshot with full path
            screenshot_path = os.path.join(screenshot_folder, screenshot_name)
            self.driver.save_screenshot(screenshot_path)
            logger.info(f'[{self.browser}] Screenshot saved as: {screenshot_path}')

            # Log toast message content
            toastText = toastElement.text
            logger.info(f'[{self.browser}] Toast message: {toastText}')

            return result
        
        except Exception as e:
            logger.error(f'[{self.browser}] Error checking signup result: {str(e)}')
            screenshot_name = f'signup-error-test{testNumber}.png'
            screenshot_path = os.path.join(screenshot_folder, screenshot_name)
            self.driver.save_screenshot(screenshot_path)
            logger.info(f'[{self.browser}] Error screenshot saved as: {screenshot_path}')
            return "ERROR"
    
    def runAllTests(self, credentials):
        test_results = {}
        
        try:
            count = 1
            for username, email, password, confirmPassword, *_ in credentials:
                logger.info(f'[{self.browser}] === Running Test Case {count} ===')
                test_results[count] = self.sign_up_credentials(username, email, password, confirmPassword, count)
                count += 1
            
            # Summary for this browser
            logger.info(f'[{self.browser}] === TEST SUMMARY ===')
            for test_name, result in test_results.items():
                logger.info(f'[{self.browser}] Test {test_name}: {result}')
                
        except Exception as e:
            logger.error(f'[{self.browser}] Error during test execution: {str(e)}')
        finally:
            self.cleanup()
            
        return test_results
    
    def cleanup(self):
        """Close the browser"""
        if self.driver:
            self.driver.quit()
            logger.info(f'[{self.browser}] Browser closed')

    @staticmethod
    def get_latest_git_tag():
        """Get the latest git tag for versioning screenshots"""
        try:
            return subprocess.check_output(['git', 'describe', '--tags', '--abbrev=0']).decode('utf-8').strip()
        except Exception:
            return "v0.0.0"


def run_cross_browser_tests():
    """
    Main function to run tests across all browsers
    """
    browsers = ['chrome', 'firefox', 'edge']
    all_results = {}
    
    logger.info('=' * 60)
    logger.info('STARTING CROSS-BROWSER SIGNUP TESTS')
    logger.info('=' * 60)
    
    for browser in browsers:
        logger.info('\n' + '=' * 60)
        logger.info(f'TESTING WITH {browser.upper()}')
        logger.info('=' * 60)
        
        try:
            test_runner = SignupTest(browser=browser)
            results = test_runner.runAllTests(test_runner.credentials)
            all_results[browser] = results
        except Exception as e:
            logger.error(f'Failed to run tests on {browser}: {str(e)}')
            all_results[browser] = {"error": str(e)}
    
    # Final summary across all browsers
    logger.info('\n' + '=' * 60)
    logger.info('CROSS-BROWSER TEST SUMMARY')
    logger.info('=' * 60)
    
    for browser, results in all_results.items():
        logger.info(f'\n{browser.upper()} Results:')
        if isinstance(results, dict) and "error" in results:
            logger.error(f'  Browser initialization failed: {results["error"]}')
        else:
            success_count = sum(1 for result in results.values() if result == "SUCCESS")
            failed_count = sum(1 for result in results.values() if result == "FAILED")
            error_count = sum(1 for result in results.values() if result == "ERROR")
            
            logger.info(f'  Total Tests: {len(results)}')
            logger.info(f'  Passed: {success_count}')
            logger.info(f'  Failed: {failed_count}')
            logger.info(f'  Errors: {error_count}')
            
            for test_name, result in results.items():
                logger.info(f'    Test {test_name}: {result}')
    
    logger.info('\n' + '=' * 60)
    logger.info('ALL TESTS COMPLETED')
    logger.info('=' * 60)
    
    return all_results


if __name__ == "__main__":
    results = run_cross_browser_tests()