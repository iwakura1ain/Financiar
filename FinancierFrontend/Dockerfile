FROM bayesimpact/react-base:${REACT_BASE_TAG:-latest}

COPY ./FinancierFrontend/FinancierFrontend /FinancierFrontend/

WORKDIR /FinancierFrontend

RUN ls

RUN apt install nodejs -y

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]


