1. Generating RSA private key
  > openssl genrsa -out abels-key.pem 2048

2. Generating certificate request using private key
  > openssl req -new -sha256 -key abels-key.pem -out abels-csr.pem

3. Generating certificate using certificate request and private key
  > openssl x509 -req -in abels-csr.pem -signkey abels-key.pem -out abels-cert.pem

4. ./app.js

