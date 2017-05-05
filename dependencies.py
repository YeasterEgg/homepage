from flask import Flask, request, render_template, jsonify, send_file
from flask_socketio import SocketIO
from dotenv import load_dotenv

import rndm_favicon
import json
import grequests
import requests
import pdb
import os

current_path = os.path.dirname(__file__)
dotenv_path = os.path.join(current_path, '.env')
load_dotenv(dotenv_path)

DB_FILE = "./static/db/websites.json"
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
UPDATE_CODE = os.getenv("UPDATE_CODE")
ENV = os.getenv("ENV", "development")
DEBUG = False if ENV == "production" else True
try:
  PORT = int(os.getenv("PORT", "4001"))
except:
  print("PORT env variable is not a number, you MORON!")
  PORT = 4001
