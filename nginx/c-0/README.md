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

There is two kind of variables are available for nginx configuration:

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
                        return 200 "$host \n $uri \n $args \n $arg_foo"; # Using double quate you cand embed variables directly to response
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

Consider in `try_files` **all** file except the **last one** _in this case /friendly404_ one will check relative to root.

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
The default number of worker process is `one`

**It is the good practice to set `worker_processes` number equal to cpu core number** for example in a 8 core cpu set it to 8, That's mean one worker_process for each CPU core. You can handle it automaticlly using `worker_processes auto` directive

Get CPU info:

> lscpu

`worker_connection` is the limitation number of connection each cpu core should accept. **Set it to: `ulimit -n`**. Example image machine with ulimit -n 1024 -> `worker_connection 2048;`

There for the number of request our webserver can handle at the same time is equal to `worker_processes * worker_connection`

Get the limit how many file each CPU core can open:

> ulimit -n

```txt
user www-data # Process owner
pid /var/run/nginx.pid # Configure the process id location 

worker_processes auto; # Number of worker_processes

events {
  worker_connection 1024 # Number of connection each worker process should handle
}

http {
        include mime.types;

        server {
                listen 80;

                root /sites/demo;
        }
}

```