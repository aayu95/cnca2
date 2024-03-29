# Team 15 - Assignment 2

- Aayush Mehta - 1105081 
- Abhijeet Singh - 1094984
- Anoushka Doctor - 1012827
- Muhammad Atif - 924009
- Siddharth Agarwal - 1077275

# Cluster & Cloud Computing @ The University of Melbourne

Assignment 2 for Cluster and Cloud computing : COMP90024

# Configure and Deploy instances 

Run Ansible/runTest.sh file to start automated deployment and configuration of NeCTAR instances.
- Command - sh Ansible/runTest.sh

# Script Behaviour 
This will perform following actions - 

1. Create SSH Key Pair, Security Groups, Volumes & Instances.
2. Expose instances to external internet.
3. Mount volumes on Instances.
4. Install and configure CouchDB Cluster, with all participating instances.
5. Install and configure Docker for Image containerisations.
6. Fetch code from GitHub and write on mounted volume.
7. Dockerise the Application server and Load balancer server code.
8. Run Harvesting scripts, Twitter and AURIN data.
9. Run Docker containers for Application server & Load Balancer server.
