#!/bin/bash
DIR_NAME=$1
cross-env VITE_ENTRY="examples/${DIR_NAME}/index.html" vite
