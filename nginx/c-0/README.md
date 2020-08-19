## Building NGINX from source & Adding modules

1. Download Nginx source from [nginx.org donwload page](http://nginx.org/en/download.html): `wget http://nginx.org/download/nginx-1.19.2.tar.gz`
2. Unzip the tar file: `tar -zxvf ./nginx-1.19.2.tar.gz`
3. `cd ./nginx-1.19.2/`
4. Install c compiler `apt-get install build-essential` then Run ./configure: `./configure` It tells what packages are lost in order to compile the source:

```sh
./configure: error: the HTTP rewrite module requires the PCRE library.
```

For instance in this case PCRE package that uses to determine regex expression is missed

5. Install Missed packages
   Ubuntu: `apt-get install libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev`

6. Run ./configure again this time around you should not get error and source should be ready to compile
7. Configure Nginx with [Building nginx from sources custom configuration](http://nginx.org/en/docs/configure.html):

> `./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module`

8. make and make install _compile and install_:

> make
> make install

9. Check if exists `ls -l /etc/nginx`
10. Check executable `nginx -V`
11. Run nginx service and check it:

> nginx
> ps aux | grep nginx

## Sending signals

> nginx -s stop

## Check nginx.conf sytanx

> nginx -t

## Adding ngnix Service

1. [Add nginx sevice script](https://www.nginx.com/resources/wiki/start/topics/examples/systemd/)

Save this file as `/lib/systemd/system/nginx.service`

```txt
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=syslog.target network-online.target remote-fs.target nss-lookup.target
Wants=network-online.target

[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t
ExecStart=/usr/bin/nginx
ExecReload=/usr/sbin/nginx -s reload
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Changed PIDFile and ExecStart prperty to match configure options

2. Start using systmd `systemctl start nginx`

3. Check status `systemctl stauts nginx`

4. Running on boot: `systemctl enable nginx`

Difference between `systemctl restart nginx` and `systemctl reload nginx`:

`reload`:
`restart`: Completely stop and then start nginx

## Creating virtual host

/etc/nignx/nginx.conf

```txt
events {} # Should specified in order to configure be valid

http { # Http context
        include mime.types; # Make http virtual host to response to send file with appropriate mime type (content-type) by default nginx set `content-type: text/htm` to all requests
                            # Consider mime.types is a file in the same directory ngingx.conf(/etc/nginx/nginx.conf) and path is relative to nginx.conf file `./mime.types`
        server { # Create virtual host
                listen 80;
                server_name 127.17.0.2;

                root /sites/demo; # Virtual host should serve content relative to this path e.g. If user request /index.html request should serve from /sites/demo/index.html
        }
}

```

You can also provide mime type manually using `types` context:

```
events {}

http {
        types {
                text/html html; # Use content-type: text/html for file file html extension
                text/css css;
        }

        server {
                listen 80;
                server_name 127.17.0.2;

                root /sites/demo;
        }
}

```
