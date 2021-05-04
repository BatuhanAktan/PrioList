import sys
from flask import Flask, render_template, request, redirect, Response
import random, json
app = Flask(__name__)
@app.route('/')
def output():
	# serve index template
	return render_template('popup.html', name='Joe')
@app.route('/receiver', methods = ['POST'])
def worker():
	# read json + reply
	data = request.get_json()
	result = []
	for element in data:
		result.append(element)
		print(element);
	return element
if __name__ == '__main__':
	# run!
	app.run()