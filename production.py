from server import app, socketio, thread
app.config['DEBUG'] = False

if __name__ == "__main__":
  if(app.config['DEBUG'] == False):
    thread.start()
  socketio.run(app, host="127.0.0.1", port=4002, debug=app.config['DEBUG'])
