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

    var groups = json.resourceGroups;

    json.resourceGroups.forEach(function(group) {
        var request = {
            HAR: {},
            info: {}
        };

        request.info = {
            group: group.name
        };

        request.HAR.headersSize = -1;
        request.HAR.bodySize = -1;

        group.resources.forEach(function(resource) {
            request.info.resource = resource.name;

            resource.actions.forEach(function(action) {
                request.info.method = action.method;

                request.HAR.method = action.method;
                request.HAR.url = host + resource.uriTemplate;
                request.HAR.httpVersion = 'HTTP/1.1';
                request.HAR.queryString = [];

                action.parameters.forEach(function(param) {
                    param.values.forEach(function(val) {
                        request.HAR.queryString.push({
                            name: param.name,
                            value: val.value,
                        })
                    });
                });

                action.examples.forEach(function(ex) {
                    ex.requests.forEach(function(r) {
                        request.HAR.headers = r.headers;
                        request.HAR.postData = {
                            mimeType: 'application/json',
                            text: r.body
                        }
                    });
                })
            });
        });

        requests.push(request);
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

    HAR(json).forEach(function(req) {
        var fname = req.info.group + req.info.resource + req.info.method + '.json';
        fs.writeFileSync(targetDir + '/' + fname, JSON.stringify(req.HAR));
    });
});
