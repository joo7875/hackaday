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
    async = require('async'),
    rp = require("request-promise"),
    _ = require('lodash');

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

app.get('/users', function (req, res) {

    var id = req.params.id;
    var url_project = apiData.apiUrl + '/projects' + apiData.apiKey + '&per_page=18&sortby=newest';
    var url_user = apiData.apiUrl + '/projects/' + id + '/team' + apiData.apiKey + '&per_page=18&sortby=newest';

    Promise.all([rp({uri: url_project, json:true}), rp({uri: url_user, json:true})])
      .then(([projectsApi, usersApi]) => {

          let usersList = usersApi.team.map(g => g.user);
          usersList = usersList.flat();

          const finalList = [];
          for (let i = 0; i < projectsApi.projects.length; i++) {
            const object = {};
            object.projectName = projectsApi.projects[i].name;

            for (let j = 0; j < usersList.length; j++) {
              if (projectsApi.projects[i].owner_id === usersList[j].id) {
                object.userName = usersList[j].screen_name;
              }
            }

            finalList.push(object);
          }
          res.render('index-test', {finalList});
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

var url_user = [];

app.get('/projects/page/:page_id', function (req, res) {
    console.log('\ninside /projects/page/:page_id');
    
    let page = req.params.page_id;
    console.log('req', req.params.page_id);
    // let userId = req.params.user_id;
    // console.log('req', req.params.user_id);

    var url_project = apiData.apiUrl + '/projects' + apiData.apiKey + '&page=' + page + '&per_page=6&sortby=newest';
    console.log('\nProject Data Query: ', url_project);

    // var url_user = apiData.apiUrl + '/users/' + userId + apiData.apiKey;
    // console.log('\nUser Data Query: ', url_user);


     request(url_project, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyData = JSON.parse(body);

            url_user.push(url_project);

            for (var i = 0; i < (bodyData.projects).length; i++) {
               url_user.push(apiData.apiUrl + '/users/' + (bodyData.projects[i]).owner_id + apiData.apiKey);
            }

            // for (var j = 0; j < url_user.length; j++) {
            //     console.log('Output', j + ' ' + url_user[j]);
            // }

            // ***url_user array 에 url_project 를 마지막에 더함
            console.log('Array-user', url_user);
            console.log('Array-project', url_project);

            // [] 씌우면 url_user array 속 array 가 출력, projectsApi 잘 나옴
            // .then 만 [] 씌우면 url_user[0], url_project[0] 만 출력
            // .all 만 [] 씌우면 usersApi 만 잘 나옴, projectsApi undefined
            Promise
              .all(url_user.map(value => rp({uri: value, json:true}))) 
              .then((mainApi) => {
                  res.render('main', {mainApi});
                  console.log('\nmainApi', JSON.stringify(mainApi));
              }).catch(err => {
                  console.log(err);
                  res.sendStatus(500);
              });

            url_user = [];

            // const promises = [
            //       rp({uri: url_project, json:true}), url_user.map(value => rp({uri: value, json:true}))
            // ];

            // Promise
            //   .all(promises)
            //   .then(([projectsApi, usersApi]) => {
            //       res.render('main', {projectsApi, usersApi});
            //       console.log('result', JSON.stringify(usersApi));
            //   }).catch(err => {
            //       console.log(err);
            //       res.sendStatus(500);
            //   });
        }
    });

     // console.log('Out Array', url_user);


    // request.get(url_user, function (error, response, body) {
    //     var userData = parseJSON(body);
    //     res.render('main', {
    //         usersApi: userData  
    //     });
    //     console.log('userData: ', JSON.stringify(userData));
    // });

    // Promise
    //   .all([rp({uri: url_project, json:true}), rp({uri: url_user, json:true})])
    //   .then(([projectsApi, usersApi]) => {
    //       res.render('main', {projectsApi, usersApi});
    //   }).catch(err => {
    //       console.log(err);
    //       res.sendStatus(500);
    //   });
});

app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})

app.get('/projects/detail/:project_id', function (req, res) {
    console.log('\ninside /projects/detail/:project_id');
    
    let projectId = req.params.project_id;


    var url_user = apiData.apiUrl + '/users' + apiData.apiKey;

    var url_project = apiData.apiUrl + '/projects' + apiData.apiKey + '&sortby=newest';
    var url_project_id = apiData.apiUrl + '/projects/' + projectId + apiData.apiKey;


    request.get(url_project_id, function (error, response, body) {
        var bodyData = parseJSON(body);
        
        var url_user_id = apiData.apiUrl + '/users/' + bodyData.owner_id + apiData.apiKey;

        Promise
          .all([rp({uri: url_user, json:true}), rp({uri: url_project, json:true}), rp({uri: url_project_id, json:true}), rp({uri: url_user_id, json:true})])
          .then(([usersApi, projectsApi, projectsApi_detail, usersApi_detail]) => {
              res.render('main_detail', {usersApi, projectsApi, projectsApi_detail, usersApi_detail});
          }).catch(err => {
              console.log(err);
              res.sendStatus(500);
          });
        });

    // console.log('\ninside /');
    // res.render('main.ejs', {
    //     dataType: null,
    //     apiData: null
    // });
});

// Parse URL-encoded bodies (as sent by HTML forms)


// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/test', function(request, response){
      var user_name=req.body.user;
      var password=req.body.password;
      console.log("User name = "+user_name+", password is "+password);
      res.end("yes");
});

// Queries HAD API for user data
app.get('/users/:id', function (req, res) {
    console.log('\ninside /users/:id');

    const id = parseInt(req.params.id, 10);
      if (!id) {
        return res.status(400).json({error: 'Incorrect id'});
      }

    var url = apiData.apiUrl + '/users/' + id + apiData.apiKey;

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

app.get('/projects/:id/team', function (req, res) {
    console.log('\ninside /projects/:id/team');
    var id = req.params.id,
        url = apiData.apiUrl + '/projects/' + id + '/team' + apiData.apiKey + '&sortby=newest';
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