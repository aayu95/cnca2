#!/bin/bash

. ./openrc.sh; ansible-playbook --ask-become-pass testing.yaml; ansible-playbook -i ./inventory/hosts --ask-become-pass testing_cluster.yaml
# ansible-playbook -i ./inventory/hosts --ask-become-pass testing.yaml; 
# ansible-playbook -i ./inventory/hosts --ask-become-pass testing_cluster.yaml 
