FROM centos:latest

RUN mkdir /var/www
RUN mkdir /var/www/static
RUN mkdir -p /var/www/log/supervisor
RUN mkdir -p /etc/supervisor/conf.d
RUN mkdir -p /etc/nginx
RUN mkdir -p /opt/webserver/run/

COPY . /var/www

WORKDIR /var/www

RUN yum update -y \
&& yum install epel-release -y \
&& yum install nginx -y \
&& yum install -y python39 \
&& yum install supervisor -y \
&& pip3 install -r requirements.txt

RUN cp -ar react-ui/build/. react/

RUN cp /var/www/config/nginx.conf /etc/nginx/nginx.conf
RUN cp /var/www/config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# start supervisor
CMD  ["/usr/bin/supervisord", "-n", "-e", "debug", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

EXPOSE 80

