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

:database-kafka
docker-compose up -d database_kafka
goto :eof

:all
docker-compose up -d && docker-compose -f .\apache-kafka\docker-compose.yaml up -d && yarn migration:run
goto :eof

:down
docker-compose -f .\apache-kafka\docker-compose.yaml down && docker-compose down
goto :eof

:eof
pause
