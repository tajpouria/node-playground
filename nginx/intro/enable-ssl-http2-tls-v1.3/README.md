1. Stop Nginx `docker exec <DOCKER_IP> nginx stop`
2. Create port forwarding rule in router configuration
3. Create a DNS for local IP address e.g. https://www.noip.com/
4. Setup https://letsencrypt.org/
   - Install lets encrypt
   - Generate public and private key:
> nginx -s stop

> sudo cartbot certonly --standalone  

5. ./nginx/nginx.conf
6. `docker exec <DOCKER_IP> sudo nginx`
