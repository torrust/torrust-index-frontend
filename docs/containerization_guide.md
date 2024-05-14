# Containerization Guide

- [Demo environment](#demo-environment)
- [Requirements](#requirements)
- [Container Volumes](#container-volumes)
  - [Pre-Create Host-Mapped Folders](#pre-create-host-mapped-folders)
  - [Matching Ownership ID's of Host Storage and Container Volumes](#matching-ownership-ids-of-host-storage-and-container-volumes)
  - [Mapped Tree Structure](#mapped-tree-structure)
- [Building the Container](#building-the-container)
  - [Clone and Change into Repository](#clone-and-change-into-repository)
  - [(Docker) Setup Context](#docker-setup-context)
  - [(Docker) Build](#docker-build)
  - [(Podman) Build](#podman-build)
- [Running the Container](#running-the-container)
  - [Basic Run](#basic-run)
    - [(Docker) Run Basic](#docker-run-basic)
    - [(Podman) Run Basic](#podman-run-basic)
  - [Arguments](#arguments)
    - [Environmental Variables](#environmental-variables)
  - [Sockets](#sockets)
  - [Volumes](#volumes)
- [Complete Example](#complete-example)
  - [With Docker](#with-docker)
  - [With Podman](#with-podman)
- [Docker Compose](#docker-compose)
  - [Build and Run](#build-and-run)
  - [Access Mysql with docker](#access-mysql-with-docker)
- [Links](#links)  

## Demo environment

It is simple to setup the Index GUI with the default
configuration and run it using the pre-built public docker image:

With Docker:

```sh
docker run -it torrust/index-gui:latest
```

or with Podman:

```sh
podman run -it torrust/index-gui:latest
```

## Requirements

- Tested with recent versions of Docker or Podman.

## Container Volumes

The [Containerfile](../Containerfile) (i.e. the Dockerfile) Defines one volume:

```Dockerfile
VOLUME ["/var/log/torrust/index-gui"]
```

When instancing the container image with the `docker run` or `podman run` command, we map the volumes to the local storage:

```s
./storage/index-gui/log -> /var/log/torrust/index-gui
```

> NOTE: You can adjust this mapping for your preference, however this mapping is the default in our guides and scripts.

### Pre-Create Host-Mapped Folders

Please run this command where you wish to run the container:

```sh
mkdir -p ./storage/index-gui/log/
```

### Matching Ownership ID's of Host Storage and Container Volumes

It is important that the `torrust` user has the same uid `$(id -u)` as the host mapped folders. In our [entry script](../share/container/entry_script_sh), installed to `/usr/local/bin/entry.sh` inside the container, switches to the `torrust` user created based upon the `USER_ID` environmental variable.

When running the container, you may use the `--env USER_ID="$(id -u)"` argument that gets the current user-id and passes to the container.

### Mapped Tree Structure

Using the standard mapping defined above produces this following mapped tree:

```s
storage/index-gui/
└── log                    => /var/log/torrust/index-gui (future use)
```

> NOTE: we don't support `tls` directly. You have to use a reverse proxy to access the
application using HTTPs. See <https://github.com/torrust/torrust-index/issues/131>.

## Building the Container

### Clone and Change into Repository

```sh
# Inside your dev folder
git clone https://github.com/torrust/torrust-index-gui.git; cd torrust-index-gui
```

### (Docker) Setup Context

Before starting, if you are using docker, it is helpful to reset the context to the default:

```sh
docker context use default
```

### (Docker) Build

```sh
# Release Mode
docker build --target release --tag torrust-index-gui:release --file Containerfile .

# Debug Mode
docker build --target debug --tag torrust-index-gui:debug --file Containerfile .
```

### (Podman) Build

```sh
# Release Mode
podman build --target release --tag torrust-index-gui:release --format docker --file Containerfile .

# Debug Mode
podman build --target debug --tag torrust-index-gui:debug --format docker --file Containerfile .
```

> NOTE: we use `--format docker` because `HEALTHCHECK` is not supported for OCI image format and it is ignored otherwise.

## Running the Container

### Basic Run

No arguments are needed for simply checking the container image works:

#### (Docker) Run Basic

```sh
# Release Mode
docker run -it torrust-index-gui:release

# Debug Mode
docker run -it torrust-index-gui:debug
```

#### (Podman) Run Basic

```sh
# Release Mode
podman run -it torrust-index-gui:release

# Debug Mode
podman run -it torrust-index-gui:debug
```

### Arguments

The arguments need to be placed before the image tag. i.e.

`run [arguments] torrust-index-gui:release`

#### Environmental Variables

Environmental variables are loaded through the `--env`, in the format `--env VAR="value"`.

The following environmental variables can be set:

- `USER_ID` - The user id for the runtime crated `torrust` user. Please Note: This user id should match the ownership of the host-mapped volumes, (default `1000`).
- `NUXT_PUBLIC_API_BASE` - The base [Index API](https://github.com/torrust/torrust-index) URL the Index GUI connects to (default `http://localhost:3001/v1`).
- `NITRO_HOST` - The IP on which the web application socket is bound to (default loopback IPv6 `::`).
- `NITRO_PORT` - The por on which the web application is served (default `3000`).

### Sockets

Socket ports used internally within the container can be mapped to with the `--publish` argument.

The format is: `--publish [optional_host_ip]:[host_port]:[container_port]/[optional_protocol]`, for example: `--publish 127.0.0.1:3000:80/tcp`.

The default ports can be mapped with the following (IPv4 and IPv6):

```s
--publish "0.0.0.0:3000:3000/tcp" \
--publish "[::]:3000:3000/tcp"
```

> NOTE: Inside the container it is necessary to expose a socket with the wildcard address `0.0.0.0` or `[::]` so that it may be accessible from the host. Verify that the configuration that the sockets are wildcard.

### Volumes

By default the container will install a volume for `/var/log/torrust/index-gui`, however for better administration it's good to make this volume host-mapped.

The argument to host-map volumes is `--volume`, with the format: `--volume=[host-src:]container-dest[:<options>]`.

The default mapping can be supplied with the following arguments:

```s
--volume ./storage/index-gui/log:/var/log/torrust/index-gui:Z
```

Please not the `:Z` at the end of the podman `--volume` mapping arguments, this is to give read-write permission on SELinux enabled systemd, if this doesn't work on your system, you can use `:rw` instead.

## Complete Example

### With Docker

```sh
## Setup Docker Default Context
docker context use default

## Build Container Image
docker build --target release --tag torrust-index-gui:release --file Containerfile .

## Setup Mapped Volumes
mkdir -p ./storage/index-gui/log/

## Run Torrust Index GUI Container Image (IPv6)
docker run -it \
    --env USER_ID="$(id -u)" \
    --env NUXT_PUBLIC_API_BASE="http://localhost:3001/v1" \
    --env NITRO_HOST="::" \
    --env NITRO_PORT="3000" \
    --publish "3000:3000/tcp" \
    --volume ./storage/index-gui/log:/var/log/torrust/index-gui:Z \
    torrust-index-gui:release

## Run Torrust Index GUI Container Image (IPv4)
docker run -it \
    --env USER_ID="$(id -u)" \
    --env NUXT_PUBLIC_API_BASE="http://localhost:3001/v1" \
    --env NITRO_HOST="0.0.0.0" \
    --env NITRO_PORT="3000" \
    --publish "3000:3000/tcp" \
    --volume ./storage/index-gui/log:/var/log/torrust/index-gui:Z \
    torrust-index-gui:release
```

### With Podman

```sh
## Build Container Image
podman build --target release --tag torrust-index-gui:release --file Containerfile .

## Setup Mapped Volumes
mkdir -p ./storage/index-gui/log/

## Run Torrust Index GUI Container Image (IPv6)
podman run -it \
    --env USER_ID="$(id -u)" \
    --env NUXT_PUBLIC_API_BASE="http://localhost:3001/v1" \
    --env NITRO_HOST="::" \
    --env NITRO_PORT="3000" \
    --publish "3000:3000/tcp" \
    --volume ./storage/index-gui/log:/var/log/torrust/index-gui:Z \
    torrust-index-gui:release

## Run Torrust Index GUI Container Image (IPv4)
podman run -it \
    --env USER_ID="$(id -u)" \
    --env NUXT_PUBLIC_API_BASE="http://localhost:3001/v1" \
    --env NITRO_HOST="0.0.0.0" \
    --env NITRO_PORT="3000" \
    --publish "3000:3000/tcp" \
    --volume ./storage/index-gui/log:/var/log/torrust/index-gui:Z \
    torrust-index-gui:release
```

## Docker Compose

The docker-compose configuration includes the MySQL service configuration. It's only used for the Tracker and Index.
Please refer to their documentation for more information.

### Build and Run

```sh
mkdir -p ./storage/index-gui/log/

USER_ID=${USER_ID:-1000} \
    TORRUST_INDEX_CONFIG=$(cat ./share/default/config/index.e2e.container.sqlite3.toml) \
    TORRUST_TRACKER_CONFIG_TOML=$(cat ./share/default/config/tracker.e2e.container.sqlite3.toml) \
    docker compose build

USER_ID=${USER_ID:-1000} \
    TORRUST_INDEX_CONFIG=$(cat ./share/default/config/index.e2e.container.sqlite3.toml) \
    TORRUST_INDEX_DATABASE="e2e_testing_sqlite3" \
    TORRUST_INDEX_DATABASE_DRIVER="sqlite3" \
    TORRUST_INDEX_TRACKER_API_TOKEN="MyAccessToken" \
    TORRUST_TRACKER_CONFIG_TOML=$(cat ./share/default/config/tracker.e2e.container.sqlite3.toml) \
    TORRUST_TRACKER_DATABASE="e2e_testing_sqlite3" \
    TORRUST_TRACKER_CONFIG_OVERRIDE_DB_DRIVER="Sqlite3" \
    TORRUST_TRACKER_CONFIG_OVERRIDE_HTTP_API__ACCESS_TOKENS__ADMIN="MyAccessToken" \
    docker compose up --detach --pull  always --remove-orphans    
```

After running the `compose up` command you will have these running containers:

```s
$ docker ps
CONTAINER ID   IMAGE                       COMMAND                  CREATED          STATUS                    PORTS                                                                                                                                       NAMES
87a79326ec4e   torrust-index-gui           "/usr/local/bin/entr…"   12 seconds ago   Up 10 seconds (healthy)   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp, 0.0.0.0:24678->24678/tcp, :::24678->24678/tcp                                                    torrust-index-gui-1
1e81272eea9c   torrust/index:develop       "/usr/local/bin/entr…"   12 seconds ago   Up 11 seconds (healthy)   0.0.0.0:3001->3001/tcp, :::3001->3001/tcp                                                                                                   torrust-index-1
79812c5b9c5f   torrust/tracker:develop     "/usr/local/bin/entr…"   12 seconds ago   Up 11 seconds (healthy)   0.0.0.0:1212->1212/tcp, :::1212->1212/tcp, 0.0.0.0:7070->7070/tcp, :::7070->7070/tcp, 1313/tcp, 0.0.0.0:6969->6969/udp, :::6969->6969/udp   torrust-tracker-1
36bf4c48df1d   dockage/mailcatcher:0.8.2   "entrypoint mailcatc…"   12 seconds ago   Up 11 seconds             0.0.0.0:1025->1025/tcp, :::1025->1025/tcp, 0.0.0.0:1080->1080/tcp, :::1080->1080/tcp                                                        torrust-mailcatcher-1
fc5830c1b105   mysql:8.0                   "docker-entrypoint.s…"   12 seconds ago   Up 11 seconds (healthy)   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp                                                                                        torrust-mysql-1                                                                          torrust-mysql-1
```

And you should be able to use the application, for example making a request to:

<http://127.0.0.1:3000>

You can stop the containers with:

```s
docker compose down
```

Additionally, you can delete all resources (containers, volumes, networks) with:

```s
docker compose down -v
```

### Access Mysql with docker

These are some useful commands for MySQL.

Open a shell in the MySQL container using docker or docker-compose.

```s
docker exec -it torrust-mysql-1 /bin/bash 
docker compose exec mysql /bin/bash
```

Connect to MySQL from inside the MySQL container or from the host:

```s
mysql -h127.0.0.1 -uroot -proot_secret_password
```

The when MySQL container is started the first time, it creates the database, user, and permissions needed.
If you see the error "Host is not allowed to connect to this MySQL server" you can check that users have the right permissions in the database. Make sure the user `root` and `db_user` can connect from any host (`%`).

```s
mysql> SELECT host, user FROM mysql.user;
+-----------+------------------+
| host      | user             |
+-----------+------------------+
| %         | db_user          |
| %         | root             |
| localhost | mysql.infoschema |
| localhost | mysql.session    |
| localhost | mysql.sys        |
| localhost | root             |
+-----------+------------------+
6 rows in set (0.00 sec)
```

If the database, user or permissions are not created the reason could be the MySQL container volume can be corrupted. Delete it and start again the containers.

## Links

- [Deploying Docker containers on Azure](https://docs.docker.com/cloud/aci-integration/).
- [Docker run options for ACI containers](https://docs.docker.com/cloud/aci-container-features/).
- [Quickstart: Deploy a container instance in Azure using the Docker CLI](https://learn.microsoft.com/en-us/azure/container-instances/quickstart-docker-cli).
