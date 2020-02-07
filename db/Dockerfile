FROM mcr.microsoft.com/mssql/server:2017-CU19-ubuntu-16.04

WORKDIR /usr/src/app
COPY . .
RUN chmod +x ./init-db.sh

CMD /bin/bash ./entrypoint.sh