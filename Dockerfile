FROM oven/bun:alpine
WORKDIR /usr/src/app
EXPOSE 3000
ENV DOCKER_CONTAINER=true
RUN apk --no-cache add git
CMD bun run docker:dev
