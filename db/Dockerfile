FROM alpine:latest
WORKDIR /db
COPY . .
RUN apk update && apk add sqlite
CMD [ "sh", "-c", "cat dev_db.sql | sqlite3 database.db; sqlite3 database.db" ]
