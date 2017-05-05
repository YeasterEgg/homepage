from addenda import *

app = Flask(__name__)
socketio = SocketIO(app)

@app.route("/", methods=["GET"])
def home():
  visited_website(socketio, "Homepage")
  return render_template('index.html')

@app.route("/visited_website", methods=["GET"])
def visited():
  website = request.args.get("site")
  visited_website(socketio, website)
  return jsonify({
    "result": "OK"
  })

@app.route("/researched_recipe", methods=["GET"])
def recipe():
  website = request.args.get("recipe")
  url = request.args.get("url")
  researched_recipe(socketio, website, url)
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
  return send_file(rndm_favicon.favicon(), mimetype='image/png')

@socketio.on('websiteSelected')
def website_selected(data):
  website = data["website"]
  text = "We bellezza, qualcuno ha cliccato sulla cellula di {website}, micacazzi!".format(website=website)
  send_to_telegram(text)
