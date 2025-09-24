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
    filename='selenium_test_v2.log',  # Output to file
    filemode='w'  # Overwrite file each run
)

logger = logging.getLogger('selenium_tests')


class LoginTest:
    def __init__(self):
        self.driver = webdriver.Chrome()
        self.base_url = 'https://ai-meeting-notes-ebon.vercel.app/'
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
    
if __name__ == "__main__":
    test_runner = LoginTest()
    results = test_runner
