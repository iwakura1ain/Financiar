FROM bayesimpact/react-base:${REACT_BASE_TAG:-latest}

COPY ./FinancierFrontend/FinancierFrontend /FinancierFrontend/

WORKDIR /FinancierFrontend

RUN ls

# RUN apt-get install -y nodejs

# RUN npm i -g vite

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]
