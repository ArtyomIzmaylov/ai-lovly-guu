ifneq ("$(wildcard .env)","")
    include .env
endif

init:
	cp -n .env.sample .env
	npm install && npm run start::webpack
up:
	@docker compose up -d --remove-orphans

down:
	@docker compose down --remove-orphans

exec:
	@docker compose exec -u root app sh

restart:
	make down && make up

deploy:
	kubectl apply -f ./deployment/postgres.yaml
secrets:
	kubectl create secret docker-registry registry-secret \
      --docker-server=${REGISTRY_URL} \
      --docker-username=${REGISTRY_NAME} \
      --docker-password=${REGISTRY_PASSWORD}

migration-up:
	docker run --rm -v ./migration:/liquibase/changelog \
	--network=${APP_NAME}-net \
	liquibase/liquibase \
	--changeLogFile=/liquibase/changelog \
	--url=${DATABASE_DSN} \
	--username=${POSTGRES_USER} \
	--password=${POSTGRES_PASSWORD} \
	update

migration-help:
	docker run \
	--rm -v ./migration:/liquibase/changelog \
	--network=${APP_NAME}-net \
	liquibase/liquibase --help

migration-init:
	docker run -t\
	-v ./migration/changelog:/liquibase/changelog \
	-v ./migration:/liquibase \
	liquibase/liquibase init project


