EXPRESSO = expresso

test:
	@$(EXPRESSO) test/class.expresso.js $(TEST_FLAGS)

test-cov:
	@$(MAKE) TEST_FLAGS=--cov test

.PHONY: test test-cov
