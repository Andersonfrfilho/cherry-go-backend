@echo off

:: This portion will use the paramter sent from cmd window.
call :%~1
goto :eof

:database-postgres
docker-compose up -d database_postgres
goto :eof

:database-mongo
docker-compose up -d database_mongo
goto :eof

:database-redis
docker-compose up -d database_redis
goto :eof

:kafka
docker-compose -f .\apache-kafka\docker-compose.yaml up -d
goto :eof

:databases
docker-compose up -d
goto :eof

:databases:migrations
docker-compose up -d && yarn migration:run
goto :eof

:all
docker-compose -f .\apache-kafka\docker-compose.yaml up -d&&docker-compose up -d&&yarn start:dev
goto :eof

:down
docker-compose -f .\apache-kafka\docker-compose.yaml down && docker-compose down
goto :eof

:eof
pause
