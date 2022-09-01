import pymongo
import os
import dotenv

dotenv.load_dotenv()
DB_NAME = 'RepositoryDatabase'
COLLECTION_NAME = 'Repositories'


class MongoDB:
    def __init__(self):
        self.db_name = DB_NAME
        self.collection_name = COLLECTION_NAME
        self.client = pymongo.MongoClient(os.environ.get("MONGO_CLIENT"))
        self.db = self.client[self.db_name]
        self.collection = self.db[self.collection_name]

    def insert(self, data):
        self.collection.insert_one(data)
        print('Inserted successfully')

    def find_all_repositories(self):
        return self.collection.find({'type': 'repository'}, {'_id': 0})

    def repositories_count(self):
        return self.collection.count_documents({'type': 'repository'})

    def check_availability(self, query):
        return self.collection.count_documents(query) > 0

    def find(self, query):
        return self.collection.find(query)

    def find_one(self, query):
        return self.collection.find_one(query)

    def update(self, query, data):
        self.collection.update_one(query, data)

    def delete(self, query):
        self.collection.delete_one(query)

    def close(self):
        self.client.close()
