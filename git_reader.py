import json
import requests
import pdb

def update_json(db_file):
  json_file = open(db_file, "r+")
  json_data=json_file.read()
  data = json.loads(json_data)
  list(update_ratios(site) for site in data["sites"])
  json_file.seek(0)
  json_file.write(json.dumps(data))
  json_file.truncate()

def update_ratios(site):
  endpoint = site["endpoint"]
  complete = requests.get(endpoint)
  languages = requests.get("{endpoint}/languages".format(endpoint=endpoint))
  if complete.status_code == 200 and languages.status_code == 200:
    site["length"] = complete.json()["size"]
    site["ratios"] = languages.json()
