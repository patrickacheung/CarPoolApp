#FROM node:13.8.0-buster

#RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg && \
#    mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/ && \
##    wget -q https://packages.microsoft.com/config/debian/10/prod.list && \
#    mv prod.list /etc/apt/sources.list.d/microsoft-prod.list && \
#    chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg && \
#    chown root:root /etc/apt/sources.list.d/microsoft-prod.list && \
##    apt-get update && \
#    apt-get install -y apt-transport-https libunwind-dev && \
#    apt-get update && \
#    ACCEPT_EULA=Y DEBIAN_FRONTEND=noninteractive apt-get -y install dotnet-sdk-3.1

#WORKDIR /usr/src/app
#COPY . .
#USER node
#WORKDIR /usr/src/app/CarPoolApp
#RUN npm install
#RUN dotnet publish --configuration Release --output bin -r linux-x64

#CMD /usr/bin/dotnet /usr/src/app/CarPoolApp/bin/Release/netcoreapp2.0/linux-x64/CarPoolApp.dll

FROM ubuntu:16.04

RUN apt-get update && apt-get install -y wget apt-transport-https curl libunwind-dev \
    liblttng-ust0 libcurl3 libkrb5-3 zlib1g libicu55 libgdiplus && \
    wget -q https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb -O \
    packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    ACCEPT_EULA=Y DEBIAN_FRONTEND=noninteractive apt-get -y install dotnet-sdk-2.1

RUN curl -sL https://deb.nodesource.com/setup_10.x  | bash - && \
    apt-get install -y nodejs

WORKDIR /usr/src/app
COPY . .
WORKDIR /usr/src/app/CarPoolApp
RUN npm install
RUN dotnet publish --configuration Release --output bin -r linux-x64

CMD /usr/bin/dotnet /usr/src/app/CarPoolApp/bin/Release/netcoreapp2.0/linux-x64/CarPoolApp.dll