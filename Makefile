EXPRESSO = expresso

MODULR = ~/sources/git_projects/modulr/bin/modulrize

CHROME = /opt/google/chrome/google-chrome

FIREFOX = /usr/bin/firefox

test:
	@$(EXPRESSO) test/class.expresso.js $(TEST_FLAGS)

test-cov:
	@$(MAKE) TEST_FLAGS=--cov test

test-chrome:
	@$(CHROME) qunit/index.html
test-firefox:
	@$(FIREFOX) qunit/index.html
build-qunit:
	@$(MODULR) qunit/pre-compiled-test.js > qunit/test.js

.PHONY: test test-cov
