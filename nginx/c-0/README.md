## Running on

> docker run -t -d ubuntu /bin/sh

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
