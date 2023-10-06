#!/usr/bin/python

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import *


print("started")
url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
driver = webdriver.Firefox()
driver.implicitly_wait(5)
driver.get(url)

text_box = driver.find_element(by=By.ID, value="constituents")
inner_text = text_box.text

split = inner_text.split("\n")
for i in range(0, 10):
    print(split[i])



