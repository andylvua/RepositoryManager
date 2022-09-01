import requests
import dotenv
import os


class GitHubAPI:
    def __init__(self):
        dotenv.load_dotenv()
        self.github_domain = 'https://github.com/'
        self.github_api_domain = 'https://api.github.com/'
        self.token = os.environ.get("GITHUB_TOKEN")
        self.headers = {'Authorization': 'token ' + self.token}

    def __validate_url(self, repository_url):
        if repository_url.startswith(self.github_domain):
            return True
        else:
            return False

    def __build_request_url(self, repository_url):
        repository_name = repository_url.split('/')[-1]
        user_name = repository_url.split('/')[-2]
        request_url = f'{self.github_api_domain}repos/{user_name}/{repository_name}'
        return request_url

    def get_repository(self, repository_url, include_languages=False):
        if not self.__validate_url(repository_url):
            return None
        request_url = self.__build_request_url(repository_url)
        print(request_url)
        response = requests.get(request_url, headers=self.headers).json()

        if response.get('message') == 'Not Found':
            return 'Not Found'

        if include_languages:
            response['languages'] = self.__get_repository_languages_distribution(request_url)

        return response

    def __get_repository_languages_distribution(self, request_url):
        request_url = request_url + '/languages'
        response = requests.get(request_url, headers=self.headers).json()

        bytes_count = 0
        for value in response.values():
            bytes_count += value

        for key, value in list(response.items()):
            value = value / bytes_count * 100
            value = round(value, 1)
            response[key] = value

        response = [{'language': key, 'percentage': value} for key, value in list(response.items())]
        return response
