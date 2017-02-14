from flask import Flask, request, render_template
from PIL import Image
from random import randint

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
  img = Image.new("RGB", (32,32))
  img.putdata(list(random_tuple() for i in range(32*32)))
  img.save("./static/favicon.png")
  print(request.remote_addr)
  return render_template('index.html')

def random_tuple():
  return (randint(0,255), randint(0,255), randint(0,255))

if __name__ == "__main__":
  app.run(host="127.0.0.1", port=4000, debug=True)
