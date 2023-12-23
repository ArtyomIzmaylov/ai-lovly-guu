ifneq ("$(wildcard .env)","")
    include .env
endif

init:
	cp -n .env.sample .env
	npm install && npm run start::webpack
up:
	@docker compose up -d --remove-orphans --build --force-recreate

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
