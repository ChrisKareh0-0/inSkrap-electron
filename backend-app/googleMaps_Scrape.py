# googleMaps_Scrape.py

import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from pymongo import MongoClient
from datetime import datetime
import os

def scrape_google_maps(keyword, location, user_id):
    # MongoDB connection
    client = MongoClient(os.getenv('MONGO_URI'))  # Ensure MONGO_URI is set in your environment variables
    db = client['inskrapDB']  # Replace with your actual database name
    history_collection = db['history']  # Collection to store history

    search_query = f"{keyword} {location}"

    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920x1080')

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    results = []  # To store all scraped data

    try:
        driver.get(f'https://www.google.com/maps/search/?api=1&query={search_query}')

        try:
            WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "form:nth-child(2)"))).click()
        except Exception:
            pass

        scrollable_div = driver.find_element(By.CSS_SELECTOR, 'div[role="feed"]')
        driver.execute_script("""
            var scrollableDiv = arguments[0];
            function scrollWithinElement(scrollableDiv) {
                return new Promise((resolve, reject) => {
                    var totalHeight = 0;
                    var distance = 1000;
                    var scrollDelay = 3000;

                    var timer = setInterval(() => {
                        var scrollHeightBefore = scrollableDiv.scrollHeight;
                        scrollableDiv.scrollBy(0, distance);
                        totalHeight += distance;

                        if (totalHeight >= scrollHeightBefore) {
                            totalHeight = 0;
                            setTimeout(() => {
                                var scrollHeightAfter = scrollableDiv.scrollHeight;
                                if (scrollHeightAfter > scrollHeightBefore) {
                                    return;
                                } else {
                                    clearInterval(timer);
                                    resolve();
                                }
                            }, scrollDelay);
                        }
                    }, 200);
                });
            }
            return scrollWithinElement(scrollableDiv);
        """, scrollable_div)

        items = driver.find_elements(By.CSS_SELECTOR, 'div[role="feed"] > div > div[jsaction]')
        
        # Updated regex to handle full phone numbers with spaces, hyphens, etc.
        phone_pattern = re.compile(r'''
            \+?                      # Optional + sign for country code
            \d{1,4}                  # Country code (1-4 digits, like +1, +44)
            [\s\-\.]?                # Optional separator (space, hyphen, dot)
            \(?\d{1,4}\)?            # Area code with or without parentheses (1-4 digits)
            [\s\-\.]?                # Optional separator (space, hyphen, dot)
            \d{1,4}                  # First segment (1-4 digits)
            [\s\-\.]?                # Optional separator (space, hyphen, dot)
            \d{1,4}                  # Second segment (1-4 digits)
            [\s\-\.]?                # Optional separator (space, hyphen, dot)
            \d{1,9}                  # Final segment (up to 9 digits)
        ''', re.VERBOSE)

        for item in items:
            data = {}

            try:
                data['title'] = item.find_element(By.CSS_SELECTOR, ".fontHeadlineSmall").text
            except Exception:
                pass

            try:
                data['link'] = item.find_element(By.CSS_SELECTOR, "a").get_attribute('href')
            except Exception:
                pass

            try:
                data['website'] = item.find_element(By.CSS_SELECTOR, 'div[role="feed"] > div > div[jsaction] div > a').get_attribute('href')
            except Exception:
                pass

            try:
                rating_text = item.find_element(By.CSS_SELECTOR, '.fontBodyMedium > span[role="img"]').get_attribute('aria-label')
                rating_numbers = [float(piece.replace(",", ".")) for piece in rating_text.split(" ") if piece.replace(",", ".").replace(".", "", 1).isdigit()]

                if rating_numbers:
                    data['stars'] = rating_numbers[0]
                    data['reviews'] = int(rating_numbers[1]) if len(rating_numbers) > 1 else 0
            except Exception:
                pass

            try:
                # Get all span tags with the phone number format
                span_tags = item.find_elements(By.CSS_SELECTOR, "span[dir='ltr']")
                phone_numbers = []

                for span in span_tags:
                    span_text = span.text
                    matches = phone_pattern.findall(span_text)
                    if matches:
                        phone_numbers.extend(matches)

                unique_phone_numbers = list(set(phone_numbers))  # Removing duplicate phone numbers
                data['phone'] = unique_phone_numbers[0] if unique_phone_numbers else None
            except Exception as e:
                print(f"Error extracting phone numbers: {e}")

            if data.get('title'):
                results.append(data)

        # Save the search query and results to the history collection
        history_entry = {
            'user_id': user_id,
            'keyword': keyword,
            'location': location,
            'search_query': search_query,
            'results': results,
            'timestamp': datetime.utcnow()
        }
        history_collection.insert_one(history_entry)

        return results  # Return the results

    finally:
        driver.quit()
