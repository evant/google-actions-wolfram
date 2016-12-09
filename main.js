'use strict';

const MAIN_INTENT = 'assistant.intent.action.MAIN'
const ASK_WOLFRAM_QUESTION = 'ASK_WOLFRAM_QUESTION'
const ASK = 'ASK'

process.env.DEBUG = 'actions-on-google:*';

require('dotenv').config();
let ActionsSdkAssistant = require('actions-on-google').ActionsSdkAssistant;
let express = require('express');
let bodyParser = require('body-parser');
let http = require('http');
let dom = require('xmldom').DOMParser
let select = require('xpath.js');
let app = express();
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json({ type: 'application/json' }));

app.post('/actions', function (request, response) {
  const assistant = new ActionsSdkAssistant({ request: request, response: response });
  assistant.handleRequest(function (assistant) {
    let intent = assistant.getIntent();
    switch (intent) {
      case MAIN_INTENT: {
        let prompt = assistant.buildInputPrompt(true, 'What is your question?');
        let action1 = assistant.buildExpectedIntent(ASK);
        assistant.ask(prompt, [action1]);
        break
      }
      case ASK: {
        console.log('response: ' + assistant.getArgument('question'));
        let query = encodeURIComponent(assistant.getRawInput());
        let url = 'http://api.wolframalpha.com/v2/query?input=' + query + '&appid=' + process.env.WOLFRAM_KEY;
        console.log('url: ' + url)
        http.get(url, function (response) {
            var body = '';
            response.on('data', function (d) {
              body += d;
            });
            response.on('end', function () {
              let doc = new dom().parseFromString(body);
              let nodes = select(doc, "//pod[@primary='true']/subpod[1]/plaintext/text()");
              if (nodes.length > 0) {
                assistant.tell(nodes[0].data);
              } else {
                console.log(doc);
                assistant.tell("Sorry, I couldn't find the answer")
              }
            });
          }).end()
        break
      }
    }
  });
});

// Start the server
let server = app.listen(app.get('port'), function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});