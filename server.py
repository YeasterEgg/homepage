from flask import Flask, request, render_template, jsonify, send_file
from flask_socketio import SocketIO
from PIL import Image
from random import randint
from itertools import repeat
from io import BytesIO
from dotenv import load_dotenv
from os.path import dirname, join
from os import getenv
from git_reader import update_json

import json
import grequests
import pdb

current_path = dirname(__file__)
dotenv_path = join(current_path, '.env')
load_dotenv(dotenv_path)

app = Flask(__name__)
app.config['DEBUG'] = True
socketio = SocketIO(app)

DB_FILE = "./static/db/websites.json"
TELEGRAM_TOKEN = getenv("TELEGRAM_TOKEN")
CHAT_ID = getenv("CHAT_ID")
UPDATE_CODE = getenv("UPDATE_CODE")
ENV = getenv("ENV")

@app.route("/", methods=["GET"])
def home():
  visited_website("Homepage")
  return render_template('index.html')

@app.route("/<template>", methods=["GET"])
def template(template):
  size = request.args.get("size") or 6
  template_file = '{}.html'.format(template)
  return render_template(template_file, size = size)

@app.route("/visited_website", methods=["GET"])
def visited():
  website = request.args.get("site")
  visited_website(website)
  return jsonify({
    "result": "OK"
  })

@app.route("/researched_recipe", methods=["GET"])
def recipe():
  website = request.args.get("recipe")
  url = request.args.get("url")
  researched_recipe(website, url)
  return jsonify({
    "result": "OK"
  })

@app.route("/sites", methods=["GET"])
def sites():
  json_file=open(DB_FILE, "r")
  json_data=json_file.read()
  data = json.loads(json_data)
  json_file.close()
  return jsonify(data)

@app.route("/update_data", methods=["POST"])
def update_data():
  update_json(DB_FILE)
  return jsonify({"result": "ok"})

@app.route("/favicon", methods=["GET"])
def favicon():
  img_io = BytesIO()
  img = Image.new("RGB", (32,32))
  ## generatorz magic! just needed a few trials
  favicon = tuple(pixel for quadrant in list(pixel for pixel in (list(repeat(pixel,32 * 16)) for pixel in random_tuple(2))) for pixel in quadrant)
  img.putdata(favicon)
  img.save(img_io, 'PNG', quality=70)
  img_io.seek(0)
  return send_file(img_io, mimetype='image/png')

@socketio.on('websiteSelected')
def handle_my_custom_event(data):
  website = data["website"]
  message = {
    "chat_id": CHAT_ID,
    "text": "We strunz, qualcuno ha controllato il sito {website}, micacazzi!".format(website=website),
  }
  url = "https://api.telegram.org/bot{token}/sendMessage".format(token=TELEGRAM_TOKEN)
  if ENV == "production":
    req = grequests.post(url, data=message)
    grequests.map([req])
  else:
    print(message["text"])

def random_tuple(n = 1):
  return tuple((randint(0,255), randint(0,255), randint(0,255)) for i in range(n))

def visited_website(website):
  socketio.emit('website_visited', {'website': website})

def researched_recipe(recipe, url):
  socketio.emit('recipe_searched', {'recipe_name': recipe, 'url': url})

if __name__ == "__main__":
  socketio.run(app, host="127.0.0.1", port=4002, debug=app.config['DEBUG'])
