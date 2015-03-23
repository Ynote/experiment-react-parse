all: server

dev: server gulp

server:
	node js/server.js

gulp:
	gulp
