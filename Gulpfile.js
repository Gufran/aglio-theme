'use strict'

var httpsnippet = require('httpsnippet');
var gulp = require('gulp');
var fs = require('fs');
var json = JSON.parse(fs.readFileSync('./apidraft.json'))['ast'];

function HAR(json) {
    var host = '';
    var requests = [];

    json.metadata.forEach(function(meta) {
        if (meta.name == 'HOST') {
            host = meta.value;
            return;
        }
    })

    json.resourceGroups.forEach(function(group) {
        group.resources.forEach(function(resource) {
            resource.actions.forEach(function(action) {
                
                var queryString = [];

                action.parameters.forEach(function(param) {
                    param.values.forEach(function(val) {
                        queryString.push({
                            name: param.name,
                            value: val.value,
                        })
                    });
                });

                action.examples.forEach(function(ex) {
                    ex.requests.forEach(function(r) {
                        var request = {
                            HAR: {},
                            info: {
                                group: group.name,
                                method: action.method,
                                resource: resource.name,
                                name: action.name,
                            }
                        };
                        
                        request.HAR.queryString = queryString;
                        request.HAR.method = action.method;
                        request.HAR.url = host + resource.uriTemplate;
                        request.HAR.httpVersion = 'HTTP/1.1';
                        request.HAR.queryString = [];
                        request.HAR.headersSize = -1;
                        request.HAR.bodySize = -1;
                        request.HAR.headers = r.headers;

                        request.HAR.postData = {
                            mimeType: 'application/json',
                            text: r.body
                        }

                        requests.push(request);
                    });
                })
            });
        });
    });

    return requests;
}

gulp.task('default', function() {
    var targetDir = 'har';

    try {
        fs.mkdirSync(targetDir);
    } catch(e) {
        if(e.code != 'EEXIST') throw e;
    }

    var har = HAR(json);

    har.forEach(function(req) {
        var fname = req.info.group + req.info.resource + req.info.method + req.info.name.replace(/\s/g, "_") + '.json';
        console.log("  writing HAR file " + fname)
        fs.writeFileSync(targetDir + '/' + fname, JSON.stringify(req.HAR));
    });
});
