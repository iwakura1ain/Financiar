FROM python:latest

COPY ./FinancierBackend /FinancierBackend/

WORKDIR /FinancierBackend

RUN pip install -r requirements.txt

CMD ["./manage.py", "runserver"]
