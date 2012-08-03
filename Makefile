SRC = $(shell find test -name "*Test.coffee")
STORES = memory mongodb

test-all:
	for i in $(STORES); do ./node_modules/mocha/bin/mocha $(SRC) --store $$i; done

test:
	./node_modules/mocha/bin/mocha $(SRC) --store memory

.PHONY: test test-all
