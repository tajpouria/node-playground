# Messing Around with postgres

### Setup

- docker cli:

postgres:

> docker run --name pg -p 5432:5432 -e POSTGRES_PASSOWRD=postgres -v $(pwd)/messsing-around-with-postgres/data:/var/lib/postgresql/data -d postgres

_additional flags: POSTGRES_USER and POSOSTGRES_DB_

pgadmin4:

> docker run --name pgadmin -p 80:80 -e PGADMIN_DEFAULT_EMAIL=email PGADMIN_DEFAULT_PASSWORD=password -d dpage/pgadmin4

- docker compose:

_caveats:_

- Use machine address in order to connect pgAdmin to postgres container
  > ip addr show
  > 192.168. . . _global tune0_
