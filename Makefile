SRC = $(shell find test -name "*Test.coffee")
STORES = memory mongodb
CMD = ./node_modules/mocha/bin/mocha

test-all:
	for i in $(STORES); do ./node_modules/mocha/bin/mocha $(SRC) --store $$i; done

test: test-memory test-mongodb

test-memory:
	$(CMD) $(SRC) --store memory

test-mongodb:
	$(CMD) $(SRC) --store mongodb

.PHONY: test-memory test-mongodb test test-all
