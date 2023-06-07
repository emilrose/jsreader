# JSReader

A WIP web tool for reading texts in a foreign language with customizable dictionary assistance and tracking of words that were looked up.

# URL

http://www.emilrose.ca/reader

# Build and copy to remote:

Assumes server with SSH config under `do` and user `root`.

```
npm run build
GOOS=linux GOARCH=amd64 go build server/main.go
rsync -av ./build ./main ./server/config ./server/database/schema do:/home/jsreader
```

# Setup server

Run directly on server:

```
# setup dependencies
apt update
apt install -y nodejs npm nginx sqlite3

# setup systemd service
ln -sf /home/jsreader/config/server.service /lib/systemd/system/server.service
service server start
systemctl daemon-reload

# setup nginx config
ln -sf /home/jsreader/config/emilrose /etc/nginx/sites-enabled/emilrose
ln -sf /home/jsreader/config/emilrose /etc/nginx/sites-available/emilrose
systemctl restart nginx

# initialize DB
python3 /home/jsreader/schema/run_migrations.py /home/reader.db
```
