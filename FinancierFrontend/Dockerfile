FROM bayesimpact/react-base:${REACT_BASE_TAG:-latest}

COPY ./FinancierFrontend /FinancierFrontend/

WORKDIR /FinancierFrontend

RUN npm install dev

CMD ["npm", "run", "dev"]


