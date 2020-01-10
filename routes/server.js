var apiData = {};
/************************************************************
*                        Instructions                       *
*                                                           *
*      Go to https://dev.hackaday.io/applications and       *
*   create an application with the following information:   *
*                                                           *
*   Application Name:       HAD API Demo                    *
*   Application Url:        http://localhost:3000           *
*   Callback Url:           http://localhost:3000/callback  *
*   Description:            API DEMO                        *
*                                                           *
************************************************************/

/************************************************************
*     Fill these out with your credentials (as strings):    *
************************************************************/
apiData.clientId = 'UZYV16rlKwE8ZhJP7hRAsXzULiKBpxzkJ7PKe6BCDzUTtQsy';
apiData.clientSecret = 'P3ZJZn5CzcBKN8pCxVSpvrSBlkWT5YXeaskVCnDZGH79OyZE';
apiData.userKey = 'nv2FXwTdSW7ZJ0aW';


// HAD API URLs:
apiData.apiKey = '?api_key=' + apiData.userKey;
apiData.apiUrl = 'https://api.hackaday.io/v1';
apiData.apiAuthUrl = 'https://api.hackaday.io/v1/me' + apiData.apiKey;
apiData.oAuthRedirect = 'https://hackaday.io/authorize?client_id=' + apiData.clientId + '&response_type=code';
apiData.createTokenUrl = function (code) {
    return ('https://auth.hackaday.io/access_token?' +
    'client_id=' + this.clientId +
    '&client_secret=' + this.clientSecret +
    '&code=' + code +
    '&grant_type=authorization_code');
};

if (!apiData.userKey || !apiData.clientId || !apiData.clientSecret) {
    console.log('Please fill in your client data!  See line 10 in server.js.');
    console.log('Ending node process.');
    process.exit();
}

var http = require('http'),
    express = require('express'), //http://expressjs.com/
    request = require('request'), // https://www.npmjs.com/package/request
    app = express(),
    server = http.createServer(app),
    port = 3000,
    async = require('async');

server.listen(port);
console.log('Listening on port: ', port);

// Enable EJS templates (http://www.embeddedjs.com/)
// app.set('views', __dirname);
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/index', function (req, res) {
    console.log('\ninside /index');
    res.render('index.ejs', {
        title: 'Index Title',
        description: 'Index Description'
    });
});

const rp = require("request-promise");

app.get('/users', function (req, res) {
    var url = apiData.apiUrl + '/users' + apiData.apiKey,
        url_test = apiData.apiUrl + '/projects' + apiData.apiKey + '&sortby=newest';

      Promise
      .all([rp({uri: url, json:true}), rp({uri: url_test, json:true})])
      .then(([apiData, apiData_test]) => {
          res.render('index-test', {apiData, apiData_test});
      }).catch(err => {
          console.log(err);
          res.sendStatus(500);
      });
    // console.log('\ninside /users');
    // res.send('respond with a resource');

    // console.log('\ninside /users');

    // var url = apiData.apiUrl + '/users' + apiData.apiKey,
    //     url_test = apiData.apiUrl + '/projects' + apiData.apiKey + '&sortby=newest';

    // request.get(url_test, function (error, response, body) {
    //     var bodyData = parseJSON(body);
    //     res.render('index-test', {
    //         apiData: bodyData
    //     });
    // });

});


app.get('/', function (req, res) {
    console.log('\ninside /');
    var url_project = apiData.apiUrl + '/projects' + apiData.apiKey + '&sortby=newest';
    console.log('\nProject Data Query: ', url_project);

    var url_user = apiData.apiUrl + '/users' + apiData.apiKey;
    console.log('\nProject Data Query: ', url_user);

    Promise
      .all([rp({uri: url_project, json:true}), rp({uri: url_user, json:true})])
      .then(([projectsApi, usersApi]) => {
          res.render('main', {projectsApi, usersApi});
      }).catch(err => {
          console.log(err);
          res.sendStatus(500);
      });

    // console.log('\ninside /');
    // res.render('main.ejs', {
    //     dataType: null,
    //     apiData: null
    // });
});

// Queries HAD API for user data
app.get('/users/:id', function (req, res) {
    console.log('\ninside /users/:id');

    var id = req.params.id,
        url = apiData.apiUrl + '/users/' + id + apiData.apiKey;

    console.log('\nUser Data Query: ', url);

    request.get(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var bodyData = parseJSON(body);
            res.render('index-test', {
                dataType: 'Top Skulled Projects',
                apiData: bodyData
            });
        } else {
            console.log('\nError: ', error, '\nResponse body: ', body);
            res.render(body);
        }
    });
});

// Queries HAD API for project data
app.get('/projects/skulls', function (req, res) {
    console.log('\ninside /projects/skulls');
    var url = apiData.apiUrl + '/projects' + apiData.apiKey + '&sortby=skulls';
    console.log('\nProject Data Query: ', url);

    request.get(url, function (error, response, body) {
        var bodyData = parseJSON(body);
        res.render('index-test', {
            dataType: 'Top Skulled Projects',
            apiData: bodyData
        });
    });
});

// HAD API oAuth
app.get('/authorize', function (req, res) {
    res.redirect(apiData.oAuthRedirect);
});

// HAD API Callback
app.get('/callback', function (req, res) {
    var code = req.query.code;
    if (!code) {
        return res.redirect('/');
    }

    console.log('\nAccess code: ', code);

    var postUrl = apiData.createTokenUrl(code);

    console.log('\nPost Url: ', postUrl);

    request.post(postUrl, function (err, res2, body) {

        var parsedData = parseJSON(body),
            token = null;

        if (parsedData) {
            token = parsedData.access_token;
        }

        if (!token) {
            console.log('\nError parsing access_token: ', body);
            return res.redirect('/');
        }

        console.log('\nToken: ', token);

        // Add token to header for oAuth queries
        var options = {
            url: apiData.apiAuthUrl,
            headers: {Authorization: 'token ' + token}
        };

        request.get(options, function (err, res3, body) {
            var bodyData = parseJSON(body);
            if (!bodyData) {
                console.log('\nError parsing bodyData');
                return res.redirect('/');
            }
            console.log('\noAuth successful!');
            res.render('index-test', {
                dataType: 'oAuth Data',
                token: token,
                apiData: bodyData
            });
        });

    });
});


app.all('*', function (req, res) {
    res.redirect('/');
});

function parseJSON (value) {
    var parsed;
    try {
        parsed = JSON.parse(value);
    } catch (e) {
        console.log('Error parsing JSON: ', e, '\nInput: ', value);
    }
    return parsed || false;
}