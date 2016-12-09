# google-actions-wolfram
Query Wolfram Alpha using Google Actions api

## Setup
1. `git clone git@github.com:evant/google-actions-wolfram.git && cd google-actions-wolfram`.
2. Go to https://developer.wolframalpha.com/portal/myapps/ and create a an app id.
3. `touch .env && echo WOLFRAM_KEY=<YOUR APP ID> > .env`.
4. Edit `"url"` in `action.json` to point to your webserver, it must be using https.
4. `npm install && node main.js`.
5. Download https://developers.google.com/actions/tools/gactions-cli and run `gactions preview` and follow the steps.
