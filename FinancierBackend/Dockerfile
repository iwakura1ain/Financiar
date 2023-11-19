FROM python:latest
ENV PYTHONUNBUFFERED 1

COPY ./FinancierBackend /FinancierBackend/

WORKDIR /FinancierBackend

RUN python3 -m pip install --upgrade pip

RUN python3 -m pip install -r requirements.txt

EXPOSE 8000

CMD ["./manage.py", "runserver", "0.0.0.0:8000"]
