import flask
import json
import os
import datetime
import pytz  # For time zone handling
from flask import Flask, render_template, render_template_string, request, jsonify, session

website = Flask(__name__)
website.secret_key = 'your_secret_key'  # Replace with a secure key

# Secure base directory for JSON data
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FILE_PATH = os.path.join(BASE_DIR, 'form_data.json')
PRODUCTS_FILE = os.path.join(BASE_DIR, 'products.json')

def is_valid_path(file_path):
    return os.path.commonpath([BASE_DIR, os.path.abspath(file_path)]).startswith(BASE_DIR)

@website.route('/')
def index():
    return flask.render_template('index.html')

@website.route('/about-us')
def about_us():
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, 'r') as f:
            data = [json.loads(line) for line in f.readlines()]
        return flask.render_template('about-us.html', data=data)
    return flask.render_template('about-us.html', data=[])

@website.route('/shop')
def shop():
    if os.path.exists(PRODUCTS_FILE):
        with open(PRODUCTS_FILE, 'r') as f:
            products = json.load(f)
        return flask.render_template('shop.html', products=products)
    return flask.render_template('shop.html', products=[])

@website.route('/get-prices', methods=['GET'])
def get_prices():
    if os.path.exists(PRODUCTS_FILE):
        with open(PRODUCTS_FILE, 'r') as f:
            products = json.load(f)
        return flask.jsonify({product['name']: product['price'] for product in products})
    return flask.jsonify({'error': 'No products found.'}), 404

@website.route('/update-price', methods=['POST'])
def update_price():
    try:
        data = flask.request.get_json()
        if os.path.exists(PRODUCTS_FILE):
            with open(PRODUCTS_FILE, 'r') as f:
                products = json.load(f)

            for product in products:
                if product['name'] == data['name']:
                    product['price'] = data['price']
                    with open(PRODUCTS_FILE, 'w') as f:
                        json.dump(products, f, indent=4)
                    return flask.jsonify({'message': f"Price for {data['name']} updated to ${data['price']}."})
            return flask.jsonify({'error': 'Product not found.'}), 404
        return flask.jsonify({'error': 'No products file found.'}), 404
    except Exception as e:
        website.logger.error(f"Error updating price: {e}")
        return flask.jsonify({'error': f'Failed to update price: {e}'}), 500

@website.route('/view-data-page')
def view_data_page():
    return flask.render_template('view-data.html')

@website.route('/manage-data')
def manage_data():
    return flask.render_template('manage-data.html')

@website.route('/view-data', methods=['GET'])
def view_data():
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, 'r') as f:
            data = f.readlines()
        return flask.jsonify({'data': [json.loads(line) for line in data]})
    return flask.jsonify({'error': 'No data found.'}), 404

@website.route('/add-data', methods=['POST'])
def add_data():
    try:
        new_data = flask.request.get_json()
        tz = pytz.timezone('Australia/Sydney')
        time = datetime.datetime.now(tz).strftime('%d-%m-%Y %H:%M:%S.%f')[:-3]
        new_data_entry = {'time': time, 'user_data': new_data}

        if not is_valid_path(FILE_PATH):
            return flask.jsonify({'error': 'Invalid file path.'}), 400

        with open(FILE_PATH, 'a') as f:
            json.dump(new_data_entry, f, indent=4)
            f.write('\n')

        return flask.jsonify({'message': 'Data added successfully!'}), 200
    except Exception as e:
        website.logger.error(f"Error adding data: {e}")
        return flask.jsonify({'error': f'Failed to add data: {e}'}), 500

@website.route('/delete-data', methods=['POST'])
def delete_data():
    try:
        index = flask.request.get_json().get('index')
        if os.path.exists(FILE_PATH):
            with open(FILE_PATH, 'r') as f:
                data = f.readlines()

            if 0 <= index < len(data):
                del data[index]

                if not is_valid_path(FILE_PATH):
                    return flask.jsonify({'error': 'Invalid file path.'}), 400

                with open(FILE_PATH, 'w') as f:
                    f.writelines(data)
                return flask.jsonify({'message': 'Data deleted successfully!'}), 200
            return flask.jsonify({'error': 'Index out of range.'}), 400
        return flask.jsonify({'error': 'No data found.'}), 404
    except Exception as e:
        website.logger.error(f"Error deleting data: {e}")
        return flask.jsonify({'error': f'Failed to delete data: {e}'}), 500

@website.errorhandler(Exception)
def handle_exception(e):
    website.logger.error(f"Unhandled exception: {e}")
    return flask.render_template('error.html'), 500

if __name__ == '__main__':
    website.run(debug=True)