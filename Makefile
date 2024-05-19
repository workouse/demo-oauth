
.PHONY: build run
build: 
	@echo "Building..."
	cd frontend && npm install && npm run build

run:
	cd backend && node index.js

deploy:
	rsync -rv --exclude-from='.rsyncignore' ./ root@64.62.195.166:/var/www/py-demo-oaut
