import requests, json

main_url = "https://food-nutrition.canada.ca/api/canadian-nutrient-file/food/?lang=en&type=json"
serving_size_url = "https://food-nutrition.canada.ca/api/canadian-nutrient-file/servingsize/?lang=en&type=json&id="
nutrients_url = "https://food-nutrition.canada.ca/api/canadian-nutrient-file/nutrientamount/?lang=en&type=json&id="
unit_url = "https://food-nutrition.canada.ca/api/canadian-nutrient-file/nutrientname/?lang=en&type=json&id="

tracked = ['Energy (kcal)', 'Protein', 'Retinol', 'Vitamin D', 'Tocopherol, alpha', 'Vitamin K', 
'Vitamin C', 'Thiamin', 'Riboflavin', 'Niacin', 'Vitamin B-6', 'Folate, naturally occurring', 
'Vitamin B-12', 'Calcium, Ca', 'Phosphorus, P', 'Magnesium, Mg', 'Iron, Fe', 'Zinc, Zn', 'Selenium, Se', 'Total Fat']

def scrape():
    food_resp = requests.get(main_url).content
    obj1 = json.loads(food_resp)
    
    my_json = []
    
    for i in range(len(obj1)):
        serve_resp = requests.get(serving_size_url+ str(obj1[i]['food_code'])).content
        nut_resp = requests.get(nutrients_url+str(obj1[i]['food_code'])).content
        obj2 = json.loads(serve_resp)
        obj3 = json.loads(nut_resp)
        serving_sizes = []
        for j in range(len(obj2)):
            serving_sizes.append({'serving_description': obj2[j]['measure_name'],
            'conversion_factor': obj2[j]['conversion_factor_value']})
        nutrients = []
        for k in range(len(obj3)):
            if obj3[k]['nutrient_value'] != 0 and obj3[k]['nutrient_web_name'] in tracked:
                unit_resp = requests.get(unit_url+str(obj3[k]['nutrient_name_id'])).content
                obj4 = json.loads(unit_resp)
                nutrients.append({'nutrient_name': obj3[k]['nutrient_web_name'], 
                'nutrient_amount': obj3[k]['nutrient_value'],
                'unit': obj4['unit']})
        my_json.append({"food_name": obj1[i]['food_description'],
        "food_code": obj1[i]['food_code'], "serving_sizes": serving_sizes,
        "nutrients": nutrients})
        print(i)
        
    with open('foods.json', 'w') as output:
        json.dump(my_json, output)

    

def main():
    scrape()

if __name__ == "__main__":
    main()