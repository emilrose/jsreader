# JSReader

A tool for reading texts in a foreign language, similar to [Readlang](https://readlang.com/).

# URL
emilrose.ca:3000

# Build and copy to remote:
```
npm run build
rsync -av --exclude '.direnv' --exclude '.git' --exclude '__pycache__' ~/repos/jsreader/build root@67.207.81.56:/root
```

# Setup server
```
sudo apt update
sudo apt install nodejs npm
npm install -g serve
```

# Run on server
```
serve -l 3000 build
```
