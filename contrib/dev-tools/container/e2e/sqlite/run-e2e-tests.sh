#!/bin/bash

CURRENT_USER_NAME=$(whoami)
CURRENT_USER_ID=$(id -u)
echo "User name: $CURRENT_USER_NAME"
echo "User   id: $CURRENT_USER_ID"

TORRUST_INDEX_GUI_USER_UID=$CURRENT_USER_ID
USER_ID=$CURRENT_USER_ID
export USER_ID
export TORRUST_INDEX_GUI_USER_UID

export TORRUST_INDEX_DATABASE="e2e_testing_sqlite3"
export TORRUST_TRACKER_DATABASE="e2e_testing_sqlite3"

# Install app
cp .env.local .env || exit 1
./contrib/dev-tools/container/e2e/sqlite/install.sh || exit 1

# Run E2E tests with Tracker in public mode

# Start E2E testing environment
./contrib/dev-tools/container/e2e/sqlite/mode/public/e2e-env-up.sh || exit 1

# Wait for conatiners to be healthy
./contrib/dev-tools/container/functions/wait_for_container_to_be_healthy.sh torrust-mysql-1 10 3 || exit 1
./contrib/dev-tools/container/functions/wait_for_container_to_be_healthy.sh torrust-tracker-1 10 3 || exit 1
./contrib/dev-tools/container/functions/wait_for_container_to_be_healthy.sh torrust-index-1 10 3 || exit 1
./contrib/dev-tools/container/functions/wait_for_container_to_be_healthy.sh torrust-index-gui-1 10 3 || exit 1

# Just to make sure that everything is up and running
docker ps

# Run E2E tests with shared app instance
CYPRESS_TRACKER_MODE=public npm run cypress:run || {
    ./contrib/dev-tools/container/e2e/sqlite/mode/public/e2e-env-down.sh
    exit 1
}

# Stop E2E testing environment
./contrib/dev-tools/container/e2e/sqlite/mode/public/e2e-env-down.sh

# Run E2E tests with Tracker in private mode

# Start E2E testing environment
./contrib/dev-tools/container/e2e/sqlite/mode/private/e2e-env-up.sh || exit 1

# Wait for conatiners to be healthy
./contrib/dev-tools/container/functions/wait_for_container_to_be_healthy.sh torrust-mysql-1 10 3 || exit 1
./contrib/dev-tools/container/functions/wait_for_container_to_be_healthy.sh torrust-tracker-1 10 3 || exit 1
./contrib/dev-tools/container/functions/wait_for_container_to_be_healthy.sh torrust-index-1 10 3 || exit 1
./contrib/dev-tools/container/functions/wait_for_container_to_be_healthy.sh torrust-index-gui-1 10 3 || exit 1

# Just to make sure that everything is up and running
docker ps

# Run E2E tests with shared app instance
CYPRESS_TRACKER_MODE=private npm run cypress:run || {
    ./contrib/dev-tools/container/e2e/sqlite/mode/private/e2e-env-down.sh
    exit 1
}

# Stop E2E testing environment
./contrib/dev-tools/container/e2e/sqlite/mode/private/e2e-env-down.sh
