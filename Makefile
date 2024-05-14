
.PHONY: build run
build: 
	@echo "Building..."
	cd frontend && npm install && npm run build

run:
	cd backend && node index.js

