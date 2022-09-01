import time
import flask

import github_api
import mongo_db

from flask import Flask, render_template, request, jsonify, make_response

app = Flask(__name__)
github = github_api.GitHubAPI()
mongo = mongo_db.MongoDB()


def abort(status_code, message):
    response = make_response(f'{message}')
    response.status_code = status_code
    flask.abort(response)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/new_repository', methods=['GET'])
def new_repository():
    return render_template('new_repository.html')


@app.route('/edit_repository', methods=['GET'])
def edit_repository():
    repository_url = request.args.get('url')
    repository_name = repository_url.split('/')[-1]
    description = request.args.get('description')

    if not mongo.check_availability({'repository_url': repository_url}):
        return render_template('repository_not_found.html', repository_name=repository_name)

    return render_template('edit_repository.html', repository_name=repository_name, description=description)


@app.route('/repositories', methods=['POST'])
def add_repository():
    repository_url = request.form.get('url')
    description = request.form.get('description')

    if mongo.check_availability({'repository_url': repository_url}):
        return abort(409, 'Repository already exists')

    response = github.get_repository(repository_url, include_languages=True)

    if not response:
        return 'Invalid URL'
    elif response == 'Not Found':
        return abort(404, 'No such repository found')

    data = {
        'type': 'repository',
        'repository_url': response['html_url'],
        'repository_name': response['name'],
        'languages': response['languages'],
        'description': description,
        'forks': response['forks_count'],
        'stars': response['stargazers_count'],
        'created_at': response['created_at'].split('T')[0],
        'updated_at': response['updated_at'].split('T')[0],
        'author': response['owner']['login'],
        'avatar_url': response['owner']['avatar_url'],
        'download_url': repository_url + f'/zipball/{response["default_branch"]}',
    }

    mongo.insert(data)
    return f'Repository {repository_url.split("/")[-1]} added successfully'


@app.route('/repositories/update_order', methods=['POST'])
def update_order():
    order = request.form.get('order')

    mongo.update({'type': 'order'}, {"$set": {'order': order}})
    return 'OK'


@app.route('/repositories_count', methods=['GET'])
def get_repositories_count():
    return jsonify(mongo.repositories_count())


@app.route('/repositories', methods=['GET'])
def get_repositories():
    repositories = [repository for repository in mongo.find_all_repositories()]

    order = eval(mongo.find_one({'type': 'order'})['order'])
    repositories.sort(key=lambda x: order.get(x["repository_url"], 9999))

    return jsonify(repositories)


@app.route('/repositories', methods=['PUT'])
def update_repository():
    repository_url = request.form.get('url')
    description = request.form.get('description')

    mongo.update({'repository_url': repository_url}, {"$set": {'description': description}})
    return f'Repository {repository_url.split("/")[-1]} updated successfully'


@app.route('/repositories', methods=['DELETE'])
def delete_repository():
    repository_url = request.form.get('url')

    print("Deleting repository" + repository_url)
    mongo.delete({'repository_url': repository_url})
    return f'Repository {repository_url.split("/")[-1]} deleted successfully'


if __name__ == '__main__':
    app.run(debug=True)
