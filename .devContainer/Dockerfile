FROM node:22.11.0-bullseye

RUN apt-get update && apt-get install -y git wait-for-it
RUN npm install -g npm@11.1.0

#RUN apt-get install -y python3 python3-pip
#RUN pip3 install uv
#ENV PATH="/root/.local/bin:${PATH}"
#RUN uv tool install --python python3.12 aider-chat==0.74.2
#RUN uv tool update-shell

# RUN node -v && \
#     npm -v && \
#     python3 --version && \
#     uv --version && \
#     aider --version

RUN node -v && \ 
    npm -v 
WORKDIR /workspace

CMD ["sleep", "infinity"] 