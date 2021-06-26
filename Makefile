kafka:
	docker-compose -f ./apache-kafka/docker-compose.yaml up -d
.PHONY: kafka

queue:
	yarn start:queue
.PHONY: worker

database-postgres:
	docker-compose up -d database-postgres
.PHONY: database-postgres

database-redis:
	docker-compose up -d database-redis
.PHONY: database-redis

database-mongo:
	docker-compose up -d database-mongo
.PHONY: database-mongo

databases-down:
  docker-compose stop
.PHONY: down-database

kafka-down:
  docker-compose -f ./apache-kafka/docker-compose.yaml down
.PHONY: down-kafka

setup-env:
	cp .env.example env
.PHONY: setup-env

postgres-migration:
	yarn migration:run
.PHONY: pre-migration

app-dev:
	yarn start:dev
.PHONY: worker

all:
	$(MAKE) kafka database-postgres database-redis database-mongo queue postgres-migration app-dev
.PHONY: all

down:
	$(MAKE) kafka-down databases-down
.PHONY: all

clean:
	docker rmi $(shell docker images -f "dangling=true" -q)
.PHONY: clean
