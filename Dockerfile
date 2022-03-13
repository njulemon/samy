FROM debian:latest

ENV DJANGO_SUPERUSER_USERNAME XXX
ENV DJANGO_SUPERUSER_PASSWORD XXX
ENV DJANGO_SUPERUSER_EMAIL XXX
ENV REACT_APP_HOST_PORT_COMPLETE http://127.0.0.1:8000
ENV SMTP_USERNAME XXX nicolas.julemont@gmail.com
ENV SMTP_PASSWORD XXX
ENV HOST localhost

RUN mkdir /var/www
RUN mkdir /var/www/static
RUN mkdir -p /var/www/log/supervisor
RUN mkdir -p /etc/supervisor/conf.d
RUN mkdir -p /etc/nginx
RUN mkdir -p /opt/webserver/run/

COPY . /var/www

WORKDIR /var

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install wget software-properties-common build-essential libnss3-dev zlib1g-dev libgdbm-dev libncurses5-dev   libssl-dev libffi-dev libreadline-dev libsqlite3-dev libbz2-dev -y
RUN wget https://www.python.org/ftp/python/3.9.10/Python-3.9.10.tgz
RUN tar xvf Python-3.9.10.tgz
RUN ./Python-3.9.10/configure --enable-optimizations
RUN make altinstall
RUN /usr/local/bin/python3.9 -m pip install --upgrade pip
RUN apt-get install nginx -y
RUN apt-get install supervisor -y

WORKDIR /var/www

RUN python3.9 -m pip install -r requirements.txt
RUN cp -ar react-ui/build/. react/

RUN cp /var/www/config/nginx.conf /etc/nginx/nginx.conf
RUN cp /var/www/config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# start supervisor
CMD  ["/usr/bin/supervisord", "-n", "-e", "debug", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

EXPOSE 80

