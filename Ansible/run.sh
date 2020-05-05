#!/bin/bash

. ./openrc.sh; ansible-playbook -i hosts couchdb_install_setup.yaml 
