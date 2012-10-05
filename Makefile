SRC = $(shell find test/cases -name client -prune -o -name '*Test.coffee' -print)
STORES = memory mongodb
CMD = node_modules/mocha/bin/mocha
DIR = $(shell pwd)
GRUNT = grunt
FOREVER = forever
PORT = 3210
TEST_URL = http://localhost:$(PORT)/?test=support,application,store,model
CLIENT_PID = null
TEST_SERVER_PATH = test/example/server
# if node version is less than 8 (if you know how to clean this up, would love to know).
NODE_VERSION = $(shell node --version)
NODE_VERSION_LT_8 = $(shell node -e "console.log(process.version < 'v0.8.0')")
NODE_VERSION_LT_6	= $(shell node -e "console.log(process.version < 'v0.6.0')")

PATH_SEP = $(shell node -e "console.log(require('path').sep)")
# darwin (mac), linux, win32 (windows)
OS = $(shell node -e "console.log(process.platform)")
INSTALL = bin$(PATH_SEP)install

ifeq (win32,$(OS))
	# Windows:
	RUN = 
else
	# Unix
	RUN = ./
endif

install-dependencies:
	@$(shell $(INSTALL) dependencies)

install-message:
	@$(INSTALL) message

post-install: install-dependencies install-message

all: clean
	$(GRUNT) --config $(RUN)grunt.coffee
	
check-grunt:
ifeq ($(shell which $(GRUNT)),)
	$(eval GRUNT = $(shell pwd)$(PATH_SEP)node_modules$(PATH_SEP)grunt$(PATH_SEP)bin$(PATH_SEP)grunt)
ifeq ($(shell which $(RUN)node_modules$(PATH_SEP)grunt$(PATH_SEP)bin$(PATH_SEP)grunt),)	
	npm install grunt
endif
endif

# ps -ef | awk '/node server -p 3210/{print $2}' | wc -l | awk '{print $1}'
# check-server: check-forever

check-phantomjs:
ifeq ($(shell which phantomjs),) # if it's blank
	$(error PhantomJS is not installed. Download from http://phantomjs.org or run `brew install phantomjs` if you have Homebrew)
endif

test: test-server test-client

test-server: test-memory test-mongodb

test-memory:
	$(CMD) $(SRC) --store memory

test-mongodb:
	$(CMD) $(SRC) --store mongodb

test-client:
	phantomjs test$(PATH_SEP)client.coffee $(TEST_URL)

build-test-client: check-phantomjs check-grunt
	# tmp way of downloading vendor files
	rm -rf test$(PATH_SEP)example$(PATH_SEP)vendor
	$(RUN)bin$(PATH_SEP)tower new example
	mv example$(PATH_SEP)vendor test$(PATH_SEP)example
	rm -rf $(RUN)example
	$(GRUNT) --config $(RUN)grunt.coffee
	cd test$(PATH_SEP)example && pwd && npm install .
	$(GRUNT) --config $(RUN)test$(PATH_SEP)example$(PATH_SEP)grunt.coffee

start-test-client:
	node $(TEST_SERVER_PATH) -p $(PORT)

start-test-client-conditionally: test-client-pid
ifeq ($(CLIENT_PID),)
	$(shell node $(TEST_SERVER_PATH) -p $(PORT) &)
else
	@echo Server already running on port $(PORT)
endif

test-client-pid:
	$(eval CLIENT_PID = $(call get-pids,node $(TEST_SERVER_PATH)))
	@echo $(CLIENT_PID): node $(TEST_SERVER_PATH) -p $(PORT)

stop-test-client: test-client-pid

client: start-test-client test-client

define open-browser
	open -a "$(1)" $(TEST_URL)\&complete=close
endef

test-firefox:
	$(call open-browser,Firefox)

test-safari:
	$(call open-browser,Safari)

test-chrome:
	$(call open-browser,"Google\ Chrome")

test-opera:
	$(call open-browser,Opera)

test-all:
	for i in $(STORES); do $(RUN)node_modules$(PATH_SEP)mocha$(PATH_SEP)bin$(PATH_SEP)mocha $(SRC) --store $$i; done

# make push message='Committing changes'
push:
	cd wiki && git add . && git commit -a -m 'updates' && git push
	git add .
	git commit -a -m '$(message)'
	git push origin master

clean:
	rm -rf dist/*
	rm -rf lib/*

whitespace:
	cake clean

install:
	npm install
	npm install-dev

watch: clean
	$(GRUNT) start --config $(RUN)grunt.coffee

build:
	$(GRUNT) build:client --config $(RUN)grunt.coffee

dist:
	$(GRUNT) dist --config $(RUN)grunt.coffee

publish:
	npm publish

docs:
	rm -rf doc/*
	codo $(shell find packages/* -name templates -prune -o -name '*.coffee' -print) --title 'Tower API Documentation'

define kill-processes
	@echo 'killing processes...'
	@echo $(call get-processes,$(1))
	kill -9 $(call get-pids,$(1))
endef

define get-pids
	$(shell ps -ef | grep -e '$(1)' | grep -v grep | awk '{print $$2}')
endef

define get-processes
	$(shell ps -ef | grep -e '$(1)' | grep -v grep)
endef

.PHONY: all test-memory test-mongodb test test-all test-client build dist check-phantomjs check-grunt build-test-client start-test-client post-install