from flask import *

app = Flask(__name__)

users = [
    {
        "name": "Tom",
        "age": 26,
        "job": "student",
    },
    {
        "name": "David",
        "age": 36,
        "job": "construction architect"
    },
    {
        "name": "craig",
        "age": 22,
        "job": "math teacher"
    }
]

@app.route('/', methods=['GET', 'POST'])
def create():
    if request.method == 'GET':
        return users
    elif request.method == 'POST':
        return "create users"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="9988")