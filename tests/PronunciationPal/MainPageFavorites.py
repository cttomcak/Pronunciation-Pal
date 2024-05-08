# -*- coding: utf-8 -*-
import warnings ; warnings.warn = lambda *args,**kwargs: None
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class MainPageFavorites(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome(executable_path=r'.\chromedriver\win64\124.0.6367.91\chromedriver.exe')
        self.driver.implicitly_wait(30)
        self.base_url = "https://www.google.com/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_main_page_favorites(self):
        driver = self.driver
        driver.get("http://localhost:5173/")
        time.sleep(.1)
        driver.find_element_by_link_text("Login").click()
        time.sleep(.2)
        driver.find_element_by_id("email").click()
        time.sleep(.2)
        driver.find_element_by_id("email").clear()
        time.sleep(.2)
        driver.find_element_by_id("email").send_keys("test@email.com")
        time.sleep(.2)
        driver.find_element_by_id("password").click()
        time.sleep(.2)
        driver.find_element_by_id("password").clear()
        time.sleep(.2)
        driver.find_element_by_id("password").send_keys("password")
        time.sleep(.2)
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(.2)
        driver.find_element_by_xpath("//input[@type='text']").click()
        time.sleep(.2)
        driver.find_element_by_xpath("//input[@type='text']").clear()
        time.sleep(.2)
        driver.find_element_by_xpath("//input[@type='text']").send_keys("test")
        time.sleep(.2)
        driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Profile Page'])[1]/following::button[1]").click()
        time.sleep(.2)
        driver.find_element_by_xpath("//input[@type='text']").click()
        time.sleep(.2)
        driver.find_element_by_xpath("//input[@type='text']").clear()
        time.sleep(.2)
        driver.find_element_by_xpath("//input[@type='text']").send_keys("hello")
        time.sleep(.2)
        driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Profile Page'])[1]/following::button[1]").click()
        time.sleep(.2)
        driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Profile'])[1]/following::main[1]").click()
        time.sleep(.2)
        driver.find_element_by_link_text("Home").click()
        time.sleep(.2)
        driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Profile'])[1]/following::div[1]").click()
        time.sleep(.2)
        driver.find_element_by_id("hello").click()
        time.sleep(.2)
        driver.find_element_by_xpath("//img[@alt='Viseme CH']").click()
        time.sleep(.2)
        driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Hello'])[1]/following::span[1]").click()
        time.sleep(.2)
        driver.find_element_by_id("test").click()
        time.sleep(.2)
        driver.find_element_by_xpath("//img[@alt='Viseme DD']").click()
        time.sleep(.2)
        driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Hello'])[1]/following::span[1]").click()
        time.sleep(.2)
        driver.find_element_by_id("words_text_box").click()
        time.sleep(.2)
        driver.find_element_by_id("words_text_box").click()
        time.sleep(.2)
        #ERROR: Caught exception [ERROR: Unsupported command [doubleClick | id=words_text_box | ]]
        driver.find_element_by_id("words_text_box").clear()
        time.sleep(.2)
        driver.find_element_by_id("words_text_box").send_keys("temporary")
        time.sleep(.2)
        driver.find_element_by_id("words_text_box").clear()
        time.sleep(.2)
        driver.find_element_by_id("words_text_box").send_keys("temporary")
        time.sleep(.2)
        driver.find_element_by_id("words_text_box").send_keys(Keys.ENTER)
        time.sleep(.2)
        driver.find_element_by_xpath("//img[@alt='Viseme DD']").click()
        time.sleep(.2)
        driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='No Audio Available'])[1]/following::button[1]").click()
        time.sleep(.2)
        driver.find_element_by_link_text("Profile").click()
        time.sleep(.2)
        driver.find_element_by_link_text("Home").click()
        time.sleep(.2)
        driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Profile'])[1]/following::div[1]").click()
        time.sleep(.2)
        driver.find_element_by_id("temporary").click()
        time.sleep(.2)
        driver.find_element_by_link_text("Profile").click()
        time.sleep(.2)
        driver.find_element_by_id("test").click()
        time.sleep(.2)
        driver.find_element_by_id("hello").click()
        time.sleep(.2)
        driver.find_element_by_id("temporary").click()
        time.sleep(.2)
        driver.find_element_by_xpath("//button[@type='submit']").click()
        time.sleep(.2)
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()