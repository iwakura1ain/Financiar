import sys
print(sys.version)

from flask import Flask, request
from flask_restful import Resource, Api


app = Flask(__name__)
api = Api(app)

users = {
    '1': {'name': 'Alice', 'age': 26},
    '2': {'name': 'Bob', 'age': 32},
    '3': {'name': 'Charlie', 'age': 41},
}

class CreateUser(Resource):
    def post(self):
        user_id = str(int(max(users.keys()))+1)
        name = request.json['name']
        age = request.json['age']

        user = {
            'name': name,
            'age': age    
        }

        users[user_id] = user

        return {'id': user_id, 'name': name, 'age': age}

class ReadUser(Resource):
    def get(self, user_id):
        if user_id in users:
            return {'id': user_id, 'name': users[user_id]['name'], 'age': users[user_id]['age']}
        else:
            return "ERR: User not found", 404
        
class ReadAllUsers(Resource):
    def get(self):

        return users
        
class UpdateUser(Resource):
    def put(self, user_id):
        if user_id in users:
            name = request.json['name']
            age = request.json['age']

            users[user_id]['name'] = name
            users[user_id]['age'] = age

            return {'id': user_id, 'name': name, 'age': age}
        else:
            return "ERR: User not found", 404
        
class DeleteUser(Resource):
    def delete(self, user_id):
        if user_id in users:
            del users[user_id]
            return "User has been deleted."
        else:
            return "ERR: User not found", 404


            
    
api.add_resource(CreateUser, '/users')
api.add_resource(ReadAllUsers, '/users/all')
api.add_resource(ReadUser, '/users/<user_id>')
api.add_resource(UpdateUser, '/users/<user_id>')
api.add_resource(DeleteUser, '/users/<user_id>')

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)