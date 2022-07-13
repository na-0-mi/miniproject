from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

import requests
from bs4 import BeautifulSoup

from pymongo import MongoClient

client = MongoClient('mongodb+srv://test:sparta@cluster0.0qvo6.mongodb.net/?retryWrites=true&w=majority')
db = client.miniprj


@app.route('/posting')
def home():
    words = list(db.mini.find({}, {"_id": False}))
    return render_template('posting.html', words=words)


# def main():
#     # DB에서 저장된 단어 찾아서 HTML에 나타내기
#     words = list(db.words.find({}, {"_id": False}))
#     return render_template("main.html", words=words)
@app.route('/main')
def main():
    words = list(db.mini.find({}, {"_id": False}))
    return render_template("main.html", words=words)


@app.route("/mini", methods=["POST"])
def mini_post():
    gu_receive = request.form['gu_give']
    dong_receive = request.form['dong_give']
    chung_receive = request.form['chung_give']
    ann_receive = request.form['ann_give']
    gyo_receive = request.form['gyo_give']
    pyun_receive = request.form['pyun_give']

    doc = {
        'gu': gu_receive,
        'dong': dong_receive,
        'chung': chung_receive,
        'ann': ann_receive,
        'gyo': gyo_receive,
        'pyun': pyun_receive,
    }
    db.mini.insert_one(doc)

    return jsonify({'msg': '저장 완료!'})

@app.route("/check", methods=["POST"])
def check_post():
    id_receive = request.form['id_give']
    user = db.users.find_one({'id': id_receive})
    if user is not None:
        return jsonify({'msg': 0})
    else:
        return jsonify({'msg': 1})


@app.route("/boxcheck", methods=["POST"])
def boxcheck():
    checkval_receive = request.form['check_val']
    result = list(db.mini.find({'gu': {"$regex": checkval_receive}}, {'_id': False}))
    if checkval_receive == "all":
        mini_list = list(db.mini.find({}, {'_id': False}))
        return jsonify({'msg': mini_list})
    else:
        return jsonify({'msg': result})


@app.route("/mini", methods=["GET"])
def mini_get():
    mini_list = list(db.mini.find({}, {'_id': False}))
    return jsonify({'mini': mini_list})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
