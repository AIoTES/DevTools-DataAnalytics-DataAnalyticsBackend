##
##Dockerfile to build Data analytics
##Based on nodejs, ubuntu and pythonx                                                                                                                               
##

# Set the base image to ubuntu
FROM ubuntu

MAINTAINER Stefanos Stavrotheodoros <stavrotheodoros@iti.gr>

#Copy the source code to the docker image
COPY . /opt/

# install latest versionb of nodejs
RUN apt-get update \
    && apt-get install -y nodejs \
    && apt-get install -y npm

# install python 3
RUN apt-get install -y python3-pip python3-dev

# install needed python libs
RUN pip3 install -r /opt/requirements-python.txt

# set as working directory the folder of the index file
WORKDIR /opt/data_analysis_api

# install node.js modules
RUN npm install

# Expose port 8082
EXPOSE 8082

# run server
CMD [ "npm", "start" ]

# CMD [ "python", "--version" ]
# CMD [ "python3", "--version" ]
