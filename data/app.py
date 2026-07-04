from flask import Flask, request, jsonify, render_template
import json
from collections import defaultdict
import math
import datetime

app = Flask(__name__)

# ------------ Load mock data ------------
with open("data/products.json") as f:
    products = json.load(f)

with open("data/user_behavior.json") as f:
    user_behavior = json.load(f)

users = list(user_behavior.keys())
user_carts = defaultdict(list)

# ------------ Recommendation functions ------------
def collaborative_filtering(user_id):
    target_history = set([x["product"] for x in user_behavior[user_id] if x["action"] == "purchase"])
    scores = {}
    for other in users:
        if other == user_id:
            continue
        other_history = set([x["product"] for x in user_behavior[other] if x["action"] == "purchase"])
        similarity = len(target_history & other_history) / math.sqrt(
            (len(target_history) * len(other_history)) + 1e-6
        )
        scores[other] = similarity
    if scores:
        top_user = max(scores, key=scores.get)
        other_history = set([x["product"] for x in user_behavior[top_user] if x["action"] == "purchase"])
        return list(other_history - target_history)[:5]
    return []

def content_based(user_id):
    purchased = [x["product"] for x in user_behavior[user_id] if x["action"] == "purchase"]
    if not purchased:
        return []
    last_product_id = purchased[-1]
    last_category = products[last_product_id]["category"]
    recs = [pid for pid, p in products.items() if p["category"] == last_category and pid != last_product_id]
    return recs[:5]

def cart_based(user_id):
    cart = user_carts[user_id]
    recs = []
    if any("laptop" in products[p]["name"].lower() for p in cart):
        recs += ["p2", "p3"]
    return recs

def time_based():
    hour = datetime.datetime.now().hour
    if 5 <= hour < 12:
        return ["coffee1"]
    elif 18 <= hour < 23:
        return ["snack1"]
    return []

# ------------ Routes ------------

# Main pages
@app.route('/')
def home():
    return render_template('iindex.html')  # check actual filename case

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/product')
def product():
    return render_template('product.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/index')
def index_main():
    return render_template('index.html')

# API Endpoints
@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    user_id = request.args.get("user_id", "user1")
    recs = {
        "history_based": collaborative_filtering(user_id),
        "similar_products": content_based(user_id),
        "cart_based": cart_based(user_id),
        "time_based": time_based()
    }
    return jsonify(recs)

@app.route('/track_behavior', methods=['POST'])
def track_behavior():
    data = request.json
    user_id = data.get("user_id")
    action = data.get("action")
    product_id = data.get("product_id")
    user_behavior[user_id].append({"action": action, "product": product_id})
    if action == "add_to_cart":
        user_carts[user_id].append(product_id)
    return jsonify({"status": "logged"})

@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/cart', methods=['GET'])
def get_cart():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    cart_ids = user_carts[user_id]
    cart_items = [{**products[pid], "id": pid} for pid in cart_ids if pid in products]
    return jsonify(cart_items)

if __name__ == "__main__":
    app.run(debug=True)
