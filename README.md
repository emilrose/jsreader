# JSReader

A WIP web tool for reading texts in a foreign language with customizable dictionary assistance and tracking of words that were looked up.

# URL

http://www.emilrose.ca/reader

# Build and copy to remote:

Assumes server with SSH config under `do` and user `root`.

```
npm run build
go build server/main.go
rsync -av ./build ./main ./server/config do:/home/jsreader
```

# Setup server

Run directly on server:

```
# setup dependencies
sudo apt update
sudo apt install -y nodejs npm nginx

# setup systemd service
cp /home/jsreader/config/server.service /lib/systemd/system/server.service
sudo service server start
systemctl daemon-reload

# setup nginx config
sudo ln -sf /home/jsreader/config/emilrose /etc/nginx/sites-enabled/emilrose
sudo ln -sf /home/jsreader/config/emilrose /etc/nginx/sites-available/emilrose
systemctl restart nginx
```
