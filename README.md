# Jumia Frontend Project
 Jumia testcase frontend project
 
 To Run this project you will have to perform below steps:
 1- redirect to the test-app folder using below command.
 
 cd /test-app/
 
 2- Install all npm modules needed to run this project.
 npm install
 
 3- Build docker image using below commands.
 docker build -t jumia-fe .
 docker network create JumiaNetwork #in case not created yet in backend project
 docker run --name jumiafront --network JumiaNetwork -p 3001:80 -d jumia-fe

Voila, now your jumia frontend project is built successfully.
