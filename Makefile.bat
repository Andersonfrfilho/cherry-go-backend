@echo off

:: This portion will use the paramter sent from cmd window.
call :%~1
goto :eof

:database-postgres
docker-compose -p cherry-go-compose up -d database_postgres
goto :eof

:database-mongo
docker-compose -p cherry-go-compose up -d database_mongo
goto :eof

:database-redis
docker-compose -p cherry-go-compose up -d database_redis
goto :eof

:kafka
docker-compose -f .\apache-kafka\docker-compose.yaml -p cherry-go-compose up -d
goto :eof

:databases
docker-compose -p cherry-go-compose up -d database_postgres
goto :eof

:databases:migrations
docker-compose -p cherry-go-compose up -d database_postgres && yarn migration:run
goto :eof

:all
docker-compose -f .\apache-kafka\docker-compose.yaml -p cherry-go-compose up -d&&docker-compose -p cherry-go-compose up -d&&yarn start:dev
goto :eof

:down
docker-compose -f .\apache-kafka\docker-compose.yaml down && docker-compose down
goto :eof

:eof
pause
