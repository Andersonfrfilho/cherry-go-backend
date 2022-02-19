kafka:
	docker-compose -f ./apache-kafka/docker-compose.yaml -p cherry-go-compose up -d
.PHONY: kafka

kafka-down:
	docker-compose -f ./apache-kafka/docker-compose.yaml -p cherry-go-compose up -d
.PHONY: kafka-down

queue:
	yarn start:queue
.PHONY: queue

database-postgres:
	docker-compose -p cherry-go-compose up -d database_postgres
.PHONY: database-postgres

database-redis:
	docker-compose -p cherry-go-compose up -d database_redis
.PHONY: database-redis

database-mongo:
	docker-compose -p cherry-go-compose up -d database_mongo
.PHONY: database-mongo

databases:
	docker-compose -p cherry-go-compose up -d database_postgres
.PHONY: databases

databases-down:
	docker-compose down
.PHONY: databases-down

setup-env:
	cp .example.env env
.PHONY: setup-env

app-dev:
	yarn start:dev
.PHONY: app-dev

all-dev:
	$(MAKE) kafka databases app-dev
.PHONY: all

all-prod:
	$(MAKE) kafka databases app-dev
.PHONY: all

down:
	$(MAKE) kafka-down databases-down
.PHONY: down

clean:
	docker rmi $(shell docker images -f "dangling=true" -q)
.PHONY: clean
