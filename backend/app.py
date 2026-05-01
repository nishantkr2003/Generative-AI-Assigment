import os

from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from services.mongo_service import test_mongo_connection
from routes.document_routes import document_bp


# Flask App
app = Flask(__name__)

# Load Config
app.config.from_object(Config)

# Enable CORS
# CORS(app)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",   # Local Vite
                "http://127.0.0.1:5173",   # Local fallback
                "https://*.vercel.app"     # Any Vercel deployment
            ]
        }
    },
    supports_credentials=True
)


# Ensure storage folders exist
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)



# Test MongoDB
#test_mongo_connection()


# Register Universal Document Blueprint
app.register_blueprint(document_bp, url_prefix="/api/document")


# Root Health Check
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ok"
    }),200


# Local Development
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )