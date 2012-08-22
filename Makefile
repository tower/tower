SRC = $(shell find test -name "*Test.coffee")
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

test-browser:
	$(shell phantomjs test/client.js) # file://localhost$(DIR)/test/client/index.html

clean:
	rm -rf lib/*

whitespace:
	cake clean

install:
	npm install -g .

watch:
	grunt start --config ./grunt.coffee

build:
	grunt build:client --config ./grunt.coffee

dist:
	grunt dist --config ./grunt.coffee

publish:
	npm publish

.PHONY: test-memory test-mongodb test test-all check test-browser build dist
