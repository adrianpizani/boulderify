#!/bin/sh

# This script will wait for Minio to be ready before trying to configure it.

# 1. Wait for Minio server to be online by repeatedly trying to set the alias.
until mc alias set local http://localhost:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}; do
    echo "Waiting for Minio server to be ready..."
    sleep 1
done

# 2. Create the bucket. The --ignore-existing flag prevents errors if it already exists.
mc mb local/boulderify --ignore-existing

# 3. Set the bucket's access policy to public (read-only for anonymous users).
mc anonymous set public local/boulderify

echo "Success: Bucket 'boulderify' is created and public."

exit 0
