COMPOSE = docker-compose -f docker-compose.yml

.PHONY: all build start stop clean logs rebuild clean-cache restart 

all:
	$(COMPOSE) up --build --remove-orphans

build:
	$(COMPOSE) build

start:
	$(COMPOSE) up -d

stop:
	$(COMPOSE) down

down:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f

logs-server:
	$(COMPOSE) logs -f server

logs-client:
	$(COMPOSE) logs -f client

restart:
	$(COMPOSE) restart

clean:
	$(COMPOSE) down --rmi all --volumes --remove-orphans

clean-cache:
	docker builder prune -af