ifneq ("$(wildcard .env)","")
    include .env
endif

init:
	cp -n .env.sample .env
	npm install && npm run start::webpack

up:
	@docker-compose up -d --remove-orphans

down:
	@docker-compose down --remove-orphans

exec:
	@docker-compose exec -u root app sh
