from flask import *
from flask_pymongo import PyMongo

app = Flask(__name__, template_folder="template")
app.config["MONGO_URI"] = "mongodb://localhost:27017/bulletin"
app.config["SECRET_KEY"] = 'psswrd'

mongo = PyMongo(app)

app.secret_key='사용자지정비밀번호'

@app.route("/login", methods=["GET", "POST"])
def write():
    if request.method == "POST":
        email = request.form.get("email", type=str)
        pw = request.form.get("pw", type=str)

        if email == "":
            flash("Please Input EMAIL")
            return render_template("index.html")
        elif pw == "":
            flash("Please Input PW")
            return render_template("index.html")
        
        signup = mongo.db.signup
        check_cnt = signup.find({"email": email}).count()
        if check_cnt > 0:
            flash("It is a registered email")
            return render_template("index.html")
        
        to_db = {
            "email": email,
            "pw": pw
        }
        to_db_signup = signup.insert_one(to_db)
        last_signup = signup.find().sort("_id", -1).limit(5)
        for _ in last_signup:
            print(_)
        
        flash("Thank you for the signup")
        return render_template("index.html")
    else:
        return render_template("index.html")
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=9999)