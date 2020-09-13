(tech-blog http2)[https://www.perimeterx.com/tech-blog/2019/http2/)

Open SSL self-signed certificate and private key
> openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout ./.secret/key.pem -out ./.secret/cert.pem