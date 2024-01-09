FROM postgres:alpine

ENV POSTGRES_DB=dev-db
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin

COPY ./dev-db.sql /docker-entrypoint-initdb.d/
