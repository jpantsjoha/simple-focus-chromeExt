.PHONY: install lint test build clean release

install:
	npm install

lint:
	npm run lint:check

lint-fix:
	npm run lint

test:
	npm test

validate:
	npm run validate

build:
	npm run build

clean:
	rm -rf dist
	rm -rf coverage

release: lint test validate build