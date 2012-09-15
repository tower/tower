SRC = $(shell find test/cases -name client -prune -o -name '*Test.coffee' -print)
STORES = memory mongodb
CMD = ./node_modules/mocha/bin/mocha
DIR = $(shell pwd)

test-all:
	for i in $(STORES); do ./node_modules/mocha/bin/mocha $(SRC) --store $$i; done

check:
ifeq ($(shell which phantomjs),) # if it's blank
	$(error PhantomJS is not installed. Download from http://phantomjs.org or run `brew install phantomjs` if you have Homebrew)
endif

test: check test-memory test-mongodb

test-memory:
	$(CMD) $(SRC) --store memory

test-mongodb:
	$(CMD) $(SRC) --store mongodb

start-client-test-server:
	cd test/example && grunt --config ./grunt.coffee
	cd test/example && node server -p 3210

test-client:
	phantomjs test/client.coffee http://localhost:3210/?test=application,support,model,store

clean:
	rm -rf lib/*

whitespace:
	cake clean

install:
	npm install
	npm install-dev

watch:
	grunt start --config ./grunt.coffee

build:
	grunt build:client --config ./grunt.coffee

dist:
	grunt dist --config ./grunt.coffee

publish:
	npm publish

.PHONY: test-memory test-mongodb test test-all check test-client build dist start-client-test-server
