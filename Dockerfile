FROM node:18

WORKDIR /portfolio_app

COPY . . 

RUN npm install

CMD ["npm", "start"]


# docker build -t portfolio_app .
# docker image ls -> to see the image created with the image id
# docker run -p 3000:3000 docker_image_id -> to run the container outside locally.