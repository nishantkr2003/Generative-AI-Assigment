from flask import Flask, jsonify
from flask_cors import CORS

from routes.document_routes import document_bp

app = Flask(__name__)
CORS(app)

# Register Universal Document Blueprint
app.register_blueprint(document_bp, url_prefix="/api/document")


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Multi-Document RAG Backend Running Successfully"
    })


if __name__ == "__main__":
    app.run(debug=True)