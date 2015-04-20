JS := $(shell find src/ -name "*.js")

treedb.js: build node_modules
	./node_modules/.bin/browserify --standalone treedb index.js > treedb.js

build: $(JS) node_modules
	rm -rf build
	./node_modules/.bin/babel src --out-dir build --stage 1

node_modules: package.json
	npm install

.PHONY: clean
clean:
	rm -rf build treedb.js

.PHONY: test
test: node_modules
	./node_modules/.bin/mocha test/unit
