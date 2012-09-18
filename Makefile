SRC = $(shell find test/cases -name client -prune -o -name '*Test.coffee' -print)
STORES = memory mongodb
CMD = ./node_modules/mocha/bin/mocha
DIR = $(shell pwd)
GRUNT = grunt
FOREVER = forever

# @todo make this into a method
#define checkmodule
#endef
#
#check-grunt:
#	 $(call checkmodule,grunt,./node_modules/grunt/bin/grunt)

check-grunt:
ifeq ($(shell which $(GRUNT)),)
	$(eval GRUNT = $(shell pwd)/node_modules/grunt/bin/grunt)
ifeq ($(shell which ./node_modules/grunt/bin/grunt),)	
	npm install grunt
endif
endif

check-forever:
ifeq ($(shell which $(FOREVER)),)
	$(eval FOREVER = $(shell pwd)/node_modules/forever/bin/forever)
ifeq ($(shell which ./node_modules/forever/bin/forever),)	
	npm install forever
endif
endif

# ps -ef | awk '/node server -p 3210/{print $2}' | wc -l | awk '{print $1}'
# check-server: check-forever

check-phantomjs:
ifeq ($(shell which phantomjs),) # if it's blank
	$(error PhantomJS is not installed. Download from http://phantomjs.org or run `brew install phantomjs` if you have Homebrew)
endif

test: test-memory test-mongodb

test-memory:
	$(CMD) $(SRC) --store memory

test-mongodb:
	$(CMD) $(SRC) --store mongodb

test-client:
	phantomjs test/client.coffee http://localhost:3210/?test=support,application,store,model

setup-test-client: check-phantomjs check-grunt
	# tmp way of downloading vendor files
	rm -rf test/example/vendor
	./bin/tower new example
	mv example/vendor test/example
	rm -rf ./example
	$(GRUNT) --config ./grunt.coffee
	cd test/example && pwd && npm install .
	$(GRUNT) --config ./test/example/grunt.coffee

start-test-client:
	cd test/example && node server -p 3210

test-all:
	for i in $(STORES); do ./node_modules/mocha/bin/mocha $(SRC) --store $$i; done

clean:
	rm -rf lib/*

whitespace:
	cake clean

install:
	npm install
	npm install-dev

watch:
	$(GRUNT) start --config ./grunt.coffee

build:
	$(GRUNT) build:client --config ./grunt.coffee

dist:
	$(GRUNT) dist --config ./grunt.coffee

publish:
	npm publish

.PHONY: test-memory test-mongodb test test-all test-client build dist check-phantomjs check-grunt check-forever setup-test-client start-test-client
