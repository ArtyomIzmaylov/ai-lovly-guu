FROM ubuntu:latest
LABEL authors="artyom"

ENTRYPOINT ["top", "-b"]