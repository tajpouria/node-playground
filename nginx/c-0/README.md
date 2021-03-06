## Building NGINX from source & Adding modules

1. Download Nginx source from [nginx.org donwload page](http://nginx.org/en/download.html): `wget http://nginx.org/download/nginx-1.19.2.tar.gz`
2. Unzip the tar file: `tar -zxvf ./nginx-1.19.2.tar.gz`
3. `cd ./nginx-1.19.2/`
4. Install c compiler `apt-get install build-essential` then Run ./configure: `./configure` It tells what packages are lost in order to compile the source:

```sh
./configure: error: the HTTP rewrite module requires the PCRE library.
```

For instance in this case PCRE package that uses to determine regex expression is missed 5. Install Missed packages
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

## Run nginx on a specific prefix and a specific configuration [example](../open-resty-intro)

> mkdir my-project && cd my-project

> mkdir logs

> touch develop.conf

> nginx -p . -c ~/.pro/fun/node-playground/nginx/my-project/develop.conf

## Adding ngnix Service

1. [Add nginx service script](https://www.nginx.com/resources/wiki/start/topics/examples/systemd/)

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

`reload`: Check if there's not syntax error then reload
`restart`: Completely stop and then start nginx

## Creating server

```txt
events {} # Should specified in order to configure be valid

http { # Http context
        include mime.types; # Make http server to response to send file with appropriate mime type (content-type) by default nginx set `content-type: text/html` to all requests
                            # Consider mime.types is a file in the same directory nginx.conf(/etc/nginx/nginx.conf) and path is relative to nginx.conf file `./mime.types`
        server { # Create server
                listen 80;
                server_name 127.17.0.2;

                root /sites/demo; #  server should serve content relative to this path e.g. If user request /index.html request should serve from /sites/demo/index.html
        }
}

```

You can also provide mime type manually using `types` context:

```txt
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

## Location context

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;
                server_name 127.17.0.2;

                root /sites/demo;

                # Exact match (uri should be exactly 'greet' to match)
                location = /greet {
                        return 200 'Exact match'
                }

                # Preferential prefix match(If uri start with 'greet2' it match)
                location ^~ /greet2 {
                        return 200 'Preferential prefix match'
                }

                # Regex match - case *sensitive*(uri should follow Greet[0-9] pattern)
                location ~ /Greet[0-9] {
                        return 200 'Regex match - case sensitive'
                }

                # Regex match - case *insensitive*(uri should follow Greet[0-9] pattern)
                location ~* /Greet[0-9] {
                        return 200 'Regex match - case insensitive'
                }

                # Prefix match(If uri start with 'greet' it match)
                location /greet {
                        return 200 'Prefix match'
                }
        }
}
```

Nginx matching priority:

1. Exact match `location = uri`
2. Preferential prefix `location ^~ uri`
3. Regex `location ~ path` or `location ~ uri`
4. Prefix match `location uri`

## Conditions and Variables

basic condition:

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;
                server_name 127.17.0.2;

                root /sites/demo;

                if($arg_apikey != 123){ # Built-in variable mention below
                        return 401 "invalid api key"
                }
        }
}

```

**Using conditions inside the location context is highly discouraged**

There is two kind of variables available for nginx configuration:

1. [Built-in variables](http://nginx.org/en/docs/varindex.html)

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;
                server_name 127.17.0.2;

                root /sites/demo;

                location = /inspect {
                        return 200 "$host \n $uri \n $args \n $arg_foo"; # Using double quat you can embed variables directly to response
                }
        }
}

```

```sh
➜  ~ curl http://172.17.0.2/inspect\?foo\=iamfoo\&bar\=iambar
172.17.0.2
 /inspect
 foo=iamfoo&bar=iambar
 iamfoo

```

2. Manual variable

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;
                server_name 127.17.0.2;

                root /sites/demo;

                set $weekend 'No';

                if ( $date_local ~ 'Saturday|Sunday' ){
                        set $weekend 'Yes';
                }

                location = /is_weekend{
                        return 200 $weekend;
                }
        }
}

```

```sh
➜ curl http://172.17.0.2/is_weekend
No

```

## Redirect and Rewrite

- Redirect:

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;

                return 307 /greet; # Redirect all requests to /greet
        }
}

```

- Rewrite:

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;

                rewrite ^user/\w+ /greet;

                location /greet {
                        return 'hello $request_uri'
                }
        }
}

```

- Rewrite Capture groups: Wrap capture group in parentheses then you can access them using $1, $2, ...;
  For example in following case all request to /user/foo/bar will rewritten to /greet/foo/bar:

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;

                rewrite ^/user/(\w+)/(\w+) /greet/$1/$2;

                location = /greet/foo/bar {
                        return 200 'hello foo bar';
                }
        }
}

```

- Rewrite **last flag**: Specify last rewrite directive that should be evaluated:
  For example in following case if there wasn't a `last` flag here is what happening:

1. Request to /user/foo/bar rewritten to /greet/foo/bar
2. On second line it will rewritten to /thumb.png and therefore it never hit /greet/foo/bar

But since we added `last` flag on firs rewrite directive second rewrite never hit

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;

                rewrite ^/user/(\w+)/(\w+) /greet/$1/$2 last;
                rewrite /greet/foo/bar /thumb.png;

                location = /greet/foo/bar {
                        return 200 'hello foo bar';
                }
        }
}

```

## Try files

In following example request handle like so:

1. first check if `/sites/demo/$uri` exists
2. If not check if `/sites/demo/greet` exists
3. If not it will handle with `/friendly_404` location context

Consider in `try_files` **all** file except the **last one** _in this case /friendly404_ will check relative to root:

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;

                try_files $uri /greet /friendly_404;

                location = /friendly_404 {
                        return 404 "Sorry Not found!";
                }
        }
}

```

## Named location

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;

                try_files $uri /greet @friendly_404; # Make sure to no re evaluation happening on friendly_404 and request hit it directly

                location  @friendly_404 {
                        return 404 "Sorry Not found!";
                }
        }
}

```

## Logging

There is two type of log `access_log` and `error_log`.

Log configuration can specified:

- On build time:

> ./configure --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log

- As log directive:

```txt
events {}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;

                location = /secure {
                        access_log /var/log/nginx/secure.log;
                        return 200 'Secure';
                }

                location = /not-secure {
                        access_log off; # Disable access_log of /not-secure path
                        return 200 'Not-Secure';
                }
        }
}

```

## Inheritance and directive

```txt
events {}

######################
# (1) Array Directive
######################
# Can be specified multiple times without overriding a previous setting
# Gets inherited by all child contexts
# Child context can override inheritance by re-declaring directive
access_log /var/log/nginx/access.log;
access_log /var/log/nginx/custom.log.gz custom_format;

http {

  # Include statement - non directive
  include mime.types;

  server {
    listen 80;
    server_name site1.com;

    # Inherits access_log from parent context (1)
  }

  server {
    listen 80;
    server_name site2.com;

    #########################
    # (2) Standard Directive
    #########################
    # Can only be declared once. A second declaration overrides the first
    # Gets inherited by all child contexts
    # Child context can override inheritance by re-declaring directive
    root /sites/site2;

    # Completely overrides inheritance from (1)
    access_log off;

    location /images {

      # Uses root directive inherited from (2)
      try_files $uri /stock.png;
    }

    location /secret {
      #######################
      # (3) Action Directive
      #######################
      # Invokes an action such as a rewrite or redirect
      # Inheritance does not apply as the request is either stopped (redirect/response) or re-evaluated (rewrite)
      return 403 "You do not have permission to view this.";
    }
  }
}

```

## Worker processes

**Master process** is the Nginx that we started
Then Master process will spawn **worker process** to handle client requests
The default number of worker process is `1`

**It is the good practice to set `worker_processes` number equal to cpu core number** for example in a 8 core cpu set it to 8, That's mean one `worker_process` for each CPU core. You can handle it automatically using `worker_processes auto` directive

Get CPU info:

> lscpu

`worker_connection` is the limitation number of connection each cpu core should accept. **Set it to: `ulimit -n`**. Example image machine with ulimit -n 1024 -> `worker_connection 1024;`

There for the number of request our webserver can handle at the same time is equal to `worker_processes * worker_connection`

Get the limit how many file each CPU core can open:

> ulimit -n

```txt
user www-data # Process owner
pid /var/run/nginx.pid # Configure the process id location

worker_processes auto; # Number of worker_processes

events {
  worker_connection 1024; # Number of connection each worker process should handle
}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;
        }
}

```

## Buffer and timeouts

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1024;
}

http {

  include mime.types;

  # Buffer size for POST submissions
  client_body_buffer_size 10K;
  client_max_body_size 8m;

  # Buffer size for Headers
  client_header_buffer_size 1k;

  # Max time to receive client headers/body
  client_body_timeout 12;
  client_header_timeout 12;

  # Max time to keep a connection open for
  keepalive_timeout 15;

  # Max time for the client accept/receive a response
  send_timeout 10;

  # Skip buffering for static files directly send from hard and not read into memory
  sendfile on;

  # Optimise sendfile packets
  tcp_nopush on;

  server {

    listen 80;
    server_name 167.99.93.26;

    root /sites/demo;
  }
}

```

## Adding dynamic module

**Dynamic modules** being modules we can load **selectively** from Nginx configuration, unlike static modules which is always loaded

In order to add dynamic modules to Nginx we have to rebuild Nginx from source. Following is the to add an image filter module:

1. Find the dynamic module from help:

> ./configure --help | grep dynamic

```sh
  --with-http_xslt_module=dynamic    enable dynamic ngx_http_xslt_module
  --with-http_image_filter_module=dynamic # We want ot add this module
                                     enable dynamic ngx_http_image_filter_module
  --with-http_geoip_module=dynamic   enable dynamic ngx_http_geoip_module
  --with-http_perl_module=dynamic    enable dynamic ngx_http_perl_module
  --with-mail=dynamic                enable dynamic POP3/IMAP4/SMTP proxy module
  --with-stream=dynamic              enable dynamic TCP/UDP proxy module
  --with-stream_geoip_module=dynamic enable dynamic ngx_stream_geoip_module
  --add-dynamic-module=PATH          enable dynamic external module
  --with-compat                      dynamic modules compatibility

```

2. Rebuild Nginx with that module and **setup module directory configuration in order to be able easily include that module inside nginx.conf**

> ./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module --with-http_image_filter_module=dynamic --modules-path=/etc/nginx/modules

It will throw following error since it need GD library _Linux image processing lib_:

```sh
./configure: error: the HTTP image filter module requires the GD library.
You can either do not enable the module or install the libraries.

```

Run `apt-get install libgd-dev` and rebuild image

3. make && make install

4. Check the new configuration to see if newly module and module path is set. By running `Nginx -V`

5. **Load** and use it:

```txt
load_module /etc/nginx/modules/ngx_http_image_filter_module.so; # Load the dynamic module

events {}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;

                location =/thumb.png {
                        image_filter rotate 180; # Rotate the image 180 deg
                }
        }
}

```

## Header and expires

add_header:

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1048576;
}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;

                location =/thumb.png {
                        add_header X-My-Header "My-Custom-Header";
                        return 200 /thumb.png;
                }
        }
}

```

```sh
➜ curl -I http://172.17.0.2/thumb.png
HTTP/1.1 200 OK
Server: nginx/1.19.2
Date: Thu, 27 Aug 2020 06:22:03 GMT
Content-Type: image/png
Content-Length: 10
Connection: keep-alive
X-My-Header: My-Custom-Header

```

Expire header:

[MDN HTTP caching introduction](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1048576;
}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;

                location ~* \.(css|js|jpg|png)$ {
                        access_log off;
                        add_header Cache-Control public;
                        add_header Pragma public;
                        add_header Vary Accept_encoding;
                        expires 1M; # Nginx convenient way saying `add_header expires 'Fri, 15 Jun 2020 08:22:00 GMT';`
                }
        }
}

```

```sh
➜ curl -I http://172.17.0.2/thumb.png
HTTP/1.1 200 OK
Server: nginx/1.19.2
Date: Thu, 27 Aug 2020 06:37:11 GMT
Content-Type: image/png
Content-Length: 12627
Last-Modified: Wed, 11 Apr 2018 20:31:37 GMT
Connection: keep-alive
ETag: "5ace70a9-3153"
Expires: Sat, 26 Sep 2020 06:37:11 GMT
Cache-Control: max-age=2592000
Cache-Control: public
Pragma: public
Vary: Accept_encoding
Accept-Ranges: bytes

```

### Gzip

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1048576;
}

http {
        include mime.types;

        gzip on;
        gzip_comp_level 3;
        gzip_types text/css text/javascript;

        server {
                listen 80;

                root /sites/demo;
        }
}

```

```sh
➜ curl -I -H"Accept-Encoding: gzip" http://172.17.0.2/style.css # Client should specify that want gzip content
HTTP/1.1 200 OK
Server: nginx/1.19.2
Date: Sun, 30 Aug 2020 15:19:41 GMT
Content-Type: text/css
Last-Modified: Thu, 12 Apr 2018 19:12:50 GMT
Connection: keep-alive
ETag: W/"5acfafb2-3d4"
Content-Encoding: gzip # Gzip encoded

```

## Fast CGI cache

Example setting up fast_cgi with php_fpm:

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1024;
}

http {

  include mime.types;

  # Configure microcache (fastcgi)
  fastcgi_cache_path /tmp/nginx_cache levels=1:2 keys_zone=ZONE_1:100m inactive=60m;
  fastcgi_cache_key "$scheme$request_method$host$request_uri";
  add_header X-Cache $upstream_cache_status;

  server {

    listen 80;
    server_name 167.99.93.26;

    root /sites/demo;

    index index.php index.html;

    # Cache by default
    set $no_cache 0;

    # Check for cache bypass
    if ($arg_skipcache = 1) {
      set $no_cache 1;
    }

    location / {
      try_files $uri $uri/ =404;
    }

    location ~\.php$ {
      # Pass php requests to the php-fpm service (fastcgi)
      include fastcgi.conf;
      fastcgi_pass unix:/run/php/php7.1-fpm.sock;

      # Enable cache
      fastcgi_cache ZONE_1;
      fastcgi_cache_valid 200 60m;
      fastcgi_cache_bypass $no_cache;
      fastcgi_no_cache $no_cache;
    }
  }
}

```

Apache bench mark:

> sudo apt-get install apache2-utils

e.g. Sending 100 request with 10 concurrent request each time

> ab -n 100 -c 10 http://167.99.93.26/file.php

## Enable HTTP2

1. Install http_v2 module

   > ./configure --sbin-path=/usr/bin/nginx --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --with-pcre --pid-path=/var/run/nginx.pid --with-http_ssl_module --with-http_image_filter_module=dynamic --modules-path=/etc/nginx/modules --with-http_v2_module
   > make
   > make install

2. Generate SSl certificate and certificate key

> openssl req -x509 -days 10 -nodes -newkey rsa:2048 -keyout /etc/nginx/ssl/self.key -out /etc/nginx/ssl/self.crt

3. Configure and reload nginx

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1048576;
}

http {
        include mime.types;

        server {
                listen 443 ssl http2;
                server_name 172.17.0.2;


                root /sites/demo;

                ssl_certificate /etc/nginx/ssl/self.crt;
                ssl_certificate_key /etc/nginx/ssl/self.key;
        }
}

```

## HTTP web push

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1048576;
}

http {
        include mime.types;

        server {
                listen 443 ssl http2;
                server_name 172.17.0.2;

                root /sites/demo;

                ssl_certificate /etc/nginx/ssl/self.crt;
                ssl_certificate_key /etc/nginx/ssl/self.key;

                location = index.html {
                        # Web Following resources along with index.html
                        htt2_push /style.css;
                        htt2_push /thumb.png;
                }
        }
}

```

Test with nghttp2:

> sudo apt-get install nghttp2-client

> nghttp -nys https://172.17.0.2/index.html

## Redirect all HTTP request to HTTPS

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1048576;
}

http {
        include mime.types;

        # Redirect all trafic to HTTPS
        server {
                listen 80;
                server_name 172.17.0.2;
                return 301 https://$host$request_uri;
        }

        server {
                listen 443 ssl http2;
                server_name 172.17.0.2;

                root /sites/demo;

                ssl_certificate /etc/nginx/ssl/self.crt;
                ssl_certificate_key /etc/nginx/ssl/self.key;
        }
}

```

## [How to properly configure your nginx for TLS](https://medium.com/@mvuksano/how-to-properly-configure-your-nginx-for-tls-564651438fe0)

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1048576;
}

http {
        include mime.types;

        server {
                listen 443 ssl http2;
                server_name 172.17.0.2;

                # Disable SSL
                ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;

                # Optimise cipher suites
                # Nginx to tell clients that we have a preferred list of ciphers that we want to use
                ssl_prefer_server_ciphers on;
                # Setup which cipher suites should and which should not be used
                ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DH+3DES:!ADH:!AECDH:!MD5;

                # Enable Deffie Hellman(DH) key exchange param
                ssl_dhparam /etc/nginx/ssl/dhparam.pem; # dhparam key should generated using command provided after this code snippet

                # Enable HSTS When a (complying) browser receives HSTS header it will not try to contact the server using HTTP for a specified period of time
                add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always; # max-age in second

                # Optimise SSL session cache
                ssl_session_cache   shared:SSL:40m; # Cache on memory:Name of the cache:size of the cache
                ssl_session_timeout 4h;

                # Enable session tickets
                ssl_session_tickets on;

                root /sites/demo;

                ssl_certificate /etc/nginx/ssl/self.crt;
                ssl_certificate_key /etc/nginx/ssl/self.key;
        }
}

```

Generate DH Param key:

Make sure to specify dhparam size (2048) equal to TLS certificate key _/etc/nginx/ssl/self.key_

> openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048

## [Rate limitation](https://www.nginx.com/blog/rate-limiting-nginx/#:~:text=Rate%20%E2%80%93%20Sets%20the%20maximum%20request,1%20request%20every%20100%20milliseconds.)

Install [ Siege ](https://www.joedog.org/siege-manual/)

> apt-get install siege

Rate limiting is configured with two main directives, `limit_req_zone` and `limit_req`:

```txt
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;
# args:
# Key: Limiting Against request character,
# Zone: Define the shared memory zone (In this case in order to store binary representation of IP addresses)
# Rate : Set the maximum request rate NGINX track on ms so in this example 1 request every 100 ms

server {
    location /login/ {
        limit_req zone=mylimit;

        proxy_pass http://my_upstream;
    }
}

```

With current rate limit implementation _10r/s_ One IP address can make request up to 10 request every second in other word 100 request every milliseconds so performing following test:

> siege -v -r 2 -c 5 https://172.17.0.2/thumb.png # Create five cuncurrent connection and apply 2 test for each connection

Result so:

```sh
HTTP/1.1 200     0.00 secs:   12627 bytes ==> GET  /thumb.png # Just first one resolved with 200
HTTP/1.1 503     0.00 secs:     197 bytes ==> GET  /thumb.png
HTTP/1.1 503     0.00 secs:     197 bytes ==> GET  /thumb.png
HTTP/1.1 503     0.00 secs:     197 bytes ==> GET  /thumb.png
HTTP/1.1 503     0.00 secs:     197 bytes ==> GET  /thumb.png
HTTP/1.1 503     0.00 secs:     197 bytes ==> GET  /thumb.png
HTTP/1.1 503     0.00 secs:     197 bytes ==> GET  /thumb.png
HTTP/1.1 503     0.00 secs:     197 bytes ==> GET  /thumb.png
HTTP/1.1 503     0.00 secs:     197 bytes ==> GET  /thumb.png
HTTP/1.1 503     0.00 secs:     197 bytes ==> GET  /thumb.png

```

Handling burst _Buffer some requests in queue and response with delay_:

```txt
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    location /login/ {
        limit_req zone=mylimit burst=20; # Buffering up to 20 request

        proxy_pass http://my_upstream;
    }
}

```

That means if 21 requests arrive from a given IP address simultaneously, NGINX forwards the first one to the upstream server group immediately and puts the remaining 20 in the queue. It then forwards a queued request every 100 milliseconds, and returns 503 to the client only if an incoming request makes the number of queued requests go over 20.

**For most deployments, we recommend including the burst and nodelay parameters to the limit_req directive.**

Queueing with No Delay:

```txt
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    location /login/ {
        limit_req zone=mylimit burst=20 nodelay; # No delay buffering

        proxy_pass http://my_upstream;
    }
}

```

Suppose, as before, that the 20‑slot queue is empty and 21 requests arrive simultaneously from a given IP address. NGINX forwards all 21 requests immediately _since nodelay are set_ and marks the 20 slots in the queue as taken, then frees 1 slot every 100 milliseconds. (If there were 25 requests instead, NGINX would immediately forward 21 of them, mark 20 slots as taken, and reject 4 requests with status 503.)

## Basic auth

Generate user's password:

> apt-get install apache2-utils
> htpasswd -c /etc/nginx/.htpasswd foo

```txt
location /api {
    auth_basic           “Administrator’s Area”;
    auth_basic_user_file /etc/nginx/.htpasswd;
}

```

## Hardening NGINX

```txt
http {
  server_tokens off; # Remove NGINX version from server response header

  server {
    add_header X-Frame-Options "SAMEORIGIN"; # Deny cross-origin framing Simply means forbid other origins to serve your content in `iframe`
    add_header X-XSS-Protection "1; mode=block";  # Telling the browser if it detect cross site scripting attach block loading the page
  }
}

```

Reconfigure the source code `without` not necessary modules:

> ./configure --help | grep without

It will show all modules that will be added by default, Example of excluding `http_auto_index_module`:

> ./configure --without-http_auto_index_module

> make

> make install

## Renew let's encrypt certificate

At the time writing this let's encrypt SSL certificate is only valid for 90 days following is a convenient way to renew certificate using cron-tab:

> apt-get install cron

> cron-tab -e

Then add this to end of the configuration:

```txt
@daily certbot renew

```

## NGINX as reverse proxy

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1048576;
}

http {

        server {
                listen 80;
                server_name 172.17.0.2;

                location /server {
                        add_header X-Header-For-Client Hello-Client; # Client will receive this header

                        proxy_set_header X-Header-For-Server Hello-Server; # Server will receive this header

                        proxy_pass http://localhost:3000/; # If trailing '/' not specify request will proxy to '/server/rest of request_uri'; But since '/' provided request will proxy to '/res of request request_uri'
                }
        }
}

```

## NGINX as load balancer

```txt
user www-data;

worker_processes auto;

events {
  worker_connections 1048576;
}

http {
        upstream foo_servers {
                server 127.0.0.1:3000;
                server 127.0.0.1:3001;
                server 127.0.0.1:3002;
        }

        server {
                listen 80;
                server_name 172.17.0.2;

                location / {
                        proxy_pass http://foo_servers;
                }
        }
}

```

See the round robin:

> while sleep 1; do curl http://172.17.0.2; done

## [Choosing a Load-Balancing Method
