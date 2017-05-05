from dependencies import *

def update_json(db_file):
  json_file = open(db_file, "r+")
  json_data=json_file.read()
  data = json.loads(json_data)
  list(update_ratios(site) for site in data["sites"])
  json_file.seek(0)
  json_file.write(json.dumps(data, indent=2))
  json_file.truncate()

def update_ratios(site):
  endpoint = site["endpoint"]
  complete = requests.get(endpoint)
  languages = requests.get("{endpoint}/languages".format(endpoint=endpoint))
  if complete.status_code == 200 and languages.status_code == 200:
    site["length"] = complete.json()["size"]
    site["ratios"] = languages.json()

def visited_website(socketio, website):
  socketio.emit('website_visited', {'website': website})

def researched_recipe(socketio, recipe, url):
  socketio.emit('recipe_searched', {'recipe_name': recipe, 'url': url})

def send_to_telegram(text):
  message = {
    "chat_id": CHAT_ID,
    "text": text
  }
  url = "https://api.telegram.org/bot{token}/sendMessage".format(token=TELEGRAM_TOKEN)
  if ENV == "production":
    req = grequests.post(url, data=message)
    grequests.map([req])
  else:
    print(message["text"])
