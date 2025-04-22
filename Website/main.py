import flask

website = flask.Flask(__name__)

@website.route('/')
def index():
	return flask.render_template('index.html')

@website.errorhandler(404)
def page_not_found(e):
	return flask.render_template('404.html'), 404

if __name__ == '__main__':
	website.run(debug=True)