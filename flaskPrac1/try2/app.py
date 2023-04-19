from flask import *

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

app = Flask(__name__)
@app.route('/create', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        request.body
    return render_template('create.html')

@app.route('/')
def read():
    return render_template('home.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="9988")