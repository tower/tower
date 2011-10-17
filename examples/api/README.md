# Example Metro Web Service App

## Development Environment

```
brew install https://raw.github.com/mxcl/homebrew/cb6a4b4765ca4439eb03cd137cc6cbae143a8c62/Library/Formula/node.rb # heroku
npm install metro
```

## Deploy to Heroku

```
heroku create --stack cedar
git push heroku master
```

Make sure to add any new node modules to `package.json`.