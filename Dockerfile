FROM oven/bun:alpine
WORKDIR /usr/src/app
RUN apk --no-cache add nodejs npm git curl bash && git clone https://github.com/PaulexV/Everything-To-MP3.git && cd Everything-To-MP3 && bun install
EXPOSE 3000
ENV DOCKER_CONTAINER=true
CMD bun start
