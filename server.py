from app import app, socketio, PORT, DEBUG

if __name__ == "__main__":
  socketio.run(app, host="127.0.0.1", port=int(PORT), debug=DEBUG)
