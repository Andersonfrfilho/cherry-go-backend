kafka:
	docker-compose -f ./apache-kafka/docker-compose.yaml up -d
.PHONY: kafka

kafka-down:
	docker-compose -f ./apache-kafka/docker-compose.yaml up -d
.PHONY: kafka-down

queue:
	yarn start:queue
.PHONY: queue

database-postgres:
	docker-compose up -d database-postgres
.PHONY: database-postgres

database-redis:
	docker-compose up -d database-redis
.PHONY: database-redis

database-mongo:
	docker-compose up -d database-mongo
.PHONY: database-mongo

databases:
	docker-compose up -d
.PHONY: databases

databases-down:
	docker-compose down
.PHONY: databases-down

setup-env:
	cp .example.env env
.PHONY: setup-env

postgres-migration:
	yarn migration:run
.PHONY: postgres-migration

app-dev:
	yarn start:dev
.PHONY: app-dev

all:
	$(MAKE) kafka databases postgres-migration app-dev
.PHONY: all

down:
	$(MAKE) kafka-down databases-down
.PHONY: down

clean:
	docker rmi $(shell docker images -f "dangling=true" -q)
.PHONY: clean
