// Generated by LiveScript 1.3.1
(function(){
  var express, serveStatic, bing_count, async, marked, fs, app, ref$, page_markdown, page_html;
  express = require('express');
  serveStatic = require('serve-static');
  bing_count = require('bing_count');
  async = require('async');
  marked = require('marked');
  fs = require('fs');
  app = express();
  app.use(serveStatic('.'));
  app.set('port', (ref$ = process.env.PORT) != null ? ref$ : 8080);
  app.listen(app.get('port'), '0.0.0.0');
  page_markdown = function(name, callback){
    return fs.exists(name, function(exists){
      if (exists) {
        return fs.readFile(name, 'utf8', function(err, results){
          return callback(results);
        });
      } else {
        return callback(null);
      }
    });
  };
  page_html = function(name, callback){
    return page_markdown(name, function(mdata){
      if (mdata === null) {
        return callback(null);
      } else {
        return callback(marked(mdata));
      }
    });
  };
  app.get(/^\/md\/(.+)/, function(req, res){
    var name;
    name = req.params[0];
    if (name.indexOf('..') !== -1) {
      res.send('cannot have .. in path');
      return;
    }
    return page_html(name + '.md', function(data){
      if (data == null) {
        return res.send('article does not exist: ' + name);
      } else {
        return res.send(data);
      }
    });
  });
  app.get('/bingcounts', function(req, res){
    var words, output, tasks, i$, len$;
    words = req.query.words;
    output = {};
    tasks = [];
    if (words == null) {
      res.json([]);
    }
    words = JSON.parse(words);
    for (i$ = 0, len$ = words.length; i$ < len$; ++i$) {
      (fn$.call(this, words[i$]));
    }
    return async.series(tasks, function(){
      return res.json(output);
    });
    function fn$(word){
      tasks.push(function(callback){
        return bing_count(word, function(count){
          output[word] = count;
          return callback(null, null);
        });
      });
    }
  });
}).call(this);
