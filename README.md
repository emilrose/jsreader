# JSReader

A web tool for reading texts in a foreign language with customizable dictionary assistance and tracking of words that were looked up.

# URL

http://www.emilrose.ca

# Build and copy to remote:

Assumes server with SSH config under `do` and user `root`.

```
npm run build
go build server/main.go
rsync -av ./build ./main ./server/config do:/root/jsreader
```

# Setup server

Run directly on server:

```
sudo apt update
sudo apt install -y nodejs npm nginx

cp /root/jsreader/config/server.service /lib/systemd/system/server.service
sudo service server start
systemctl daemon-reload

cp /root/jsreader/config/emilrose /etc/nginx/sites-available
sudo ln -sf /etc/nginx/sites-available/emilrose /etc/nginx/sites-enabled/emilrose
systemctl restart nginx
```
