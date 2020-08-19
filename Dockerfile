FROM node

ADD ./scripts/node_startup.sh /

RUN ["chmod", "+x", "./node_startup.sh"]

EXPOSE 3000

ENTRYPOINT ["/node_startup.sh"]

CMD [ "npm", "run", "start:watch" ]