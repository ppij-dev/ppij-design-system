.PHONY: build lint test dev
build:
	node scripts/sync-version.mjs
	node scripts/generate-tokens.mjs
	cd packages/ui && npm run build && npm run build-storybook
lint:
	cd packages/ui && npx tsc -p tsconfig.json --noEmit
test:
	node scripts/check-version.mjs
	node scripts/check-stories.mjs
	node --test scripts/check-tokens.test.mjs
dev:
	cd packages/ui && npm run storybook
