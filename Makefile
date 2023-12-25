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
	docker run --rm -v $$PWD/migration/changelog:/liquibase/changelog \
	--network=${APP_NAME}-net \
	liquibase/liquibase:4.25-alpine \
	--changeLogFile=changelog-root.yml \
	--url=${DATABASE_DSN} \
	--username=${DB_USER} \
	--password=${DB_PASSWORD} \
	update
migration-gen-table:
	mkdir -p ./migration/changelog/`date +\%Y`/`date +\%m` && \
	echo "databaseChangeLog:" > ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml && \
	echo "  - changeSet:" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml && \
	echo "      id: version-`date +\%s`" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml && \
	echo "      author: your_name" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml && \
	echo "      changes:" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml && \
	echo "        - createTable:" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml && \
	echo "            tableName: table-name" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml
	echo "            columns:" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml
	echo "            - column:" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml
	echo "               name: id" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml
	echo "               type: int" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml
	echo "               autoIncrement: true" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml
	echo "               constraints:" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml
	echo "                 primaryKey: true" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml
	echo "            schemaName: schema-name" >> ./migration/changelog/`date +\%Y`/`date +\%m`/Version`date +\%s`.yml

	echo "  - include:" >> ./migration/changelog/changelog-root.yml
	echo "      file: /`date +\%Y`/`date +\%m`/Version`date +\%s`.yml" >> ./migration/changelog/changelog-root.yml

