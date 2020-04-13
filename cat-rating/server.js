/* E4 server.js */
'use strict';
const log = console.log;
const express = require('express')
const app = express();
app.use(express.static(__dirname + "/client/build"));
const bodyParser = require('body-parser')
app.use(bodyParser.json());

// Mongo and Mongoose
const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose');

const models = require('./models/models')

const cors = require('cors');
app.use(cors());

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


//app.use("/js", express.static(path.join(__dirname, '/public/src')))

app.get('/', (req, res) => {
    res.send('Hello')
})

/// Route for adding a new account
/// POST /add-user
/// Request Body :
/// {
///    username: <USERNAME>,
///    password: <PASSWORD>
/// }
app.post('/user', (req, res) => {

    const newUser = new models.User({
        username: req.body.username,
        password: req.body.password,
        name: "",
        location: "",
        email: "",
        photo: "",
        catsOwned: [],
        catsLiked: [],
        catsVoted: []
    })

    newUser.save().then((user) => {
        return res.send(user)
    }, (error) => {
        return res.status(400).send(error)
    })
})

app.get('/user', (req, res) => {
    models.User.find().then((user) => {
        return res.send(user) // can wrap in object if want to add more properties
    }, (error) => {
        res.status(500).send(error) // server error
        return;
    })
})


app.get('/user/:id', (req, res) => {
    /// req.params has the wildcard parameters in the url, in this case, id.
    // log(req.params.id)
    const id = mongoose.Types.ObjectId(req.params.id)

    // Good practise: Validate id immediately.
    if (!ObjectID.isValid(id)) {
        res.status(404).send() // if invalid id, definitely can't find resource, 404.
        return; // so that we don't run the rest of the handler.
    }
    // Otherwise, findById
    models.User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send() // could not find this student
        } else {
            /// sometimes we wrap returned object in another object:
            //res.send({student})   
            return res.send(user)
        }
    }).catch((error) => {
        res.status(500).send() // server error
    })

})

/// Route for deleting a User

// DELETE /remove-user
/// Request Body :
/// {
///    username: <USERNAME>
/// }
app.delete('/user/:id', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)

    // Validate id
    if (!ObjectID.isValid(id)) {
        res.status(404).send()
        return;
    }

    models.User.findByIdAndDelete(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            return res.send(user)
        }
    }).catch((error) => {
        res.status(500).send()
    })
})


/// Route for updating user information
/* 
Request body:
{
    "username": <USERNAME>,
    "password": <PASSWORD>,
    "name": <NAME>,
    "location": <LOCATION>,
    "email": <EMAIL>,
    "photo": <PHOTO_URL>,
}
*/
// PATCH user/<USERNAME>
app.patch('/user/:id', (req, res) => {
    const old_user_id = mongoose.Types.ObjectId(req.params.id)
    if (!ObjectID.isValid(old_user_id)) {
        res.status(404).send()
        return
    }
    models.User.findById(old_user_id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            user.username = req.body.username == null ? user.username : req.body.username;
            user.password = req.body.password == null ? user.password : req.body.password;
            user.name = req.body.name == null ? user.name : req.body.name;
            user.location = req.body.location == null ? user.location : req.body.location;
            user.email = req.body.email == null ? user.email : req.body.email;
            user.photo = req.body.photo == null ? user.photo : req.body.photo;
            user.catsOwned = req.body.catsOwned == null ? user.catsOwned : req.body.catsOwned;
            user.catsLiked = req.body.catsLiked == null ? user.catsLiked : req.body.catsLiked;
            user.catsVoted = req.body.catsVoted == null ? user.catsVoted : req.body.catsVoted;
            user.save().then((result) => {
                return res.send(user)
            }, (error) => {
                res.status(400).send(error) // 400 for bad request
            })
        }

    })
})

/// Route for adding a new cat
/// POST /cat/<username>
/// Request Body :
/* {
        "name": <NAME>,
        "photos": [],
        "birthday": <BIRTHDAY>,
        "gender": <GENDER>,
        "bio": <BIO>,
    }
*/
app.post('/cat/:userid', (req, res) => {

    const userid = mongoose.Types.ObjectId(req.params.userid)
    if (!ObjectID.isValid(userid)) {
        res.status(404).send()
        return
    }

    models.User.findById(userid).then((user) => {
        if (!user) {
            res.status(404).send()
            return
        } else {
            const newCat = new models.Cat({
                owner: user.id,
                photos: req.body.photos,
                name: req.body.name,
                birthday: req.body.birthday,
                gender: req.body.gender,
                bio: req.body.bio,
                likes: 0,
                dislikes: 0,
                likedUsers: [],
                dislikedUsers: [],
                reports: 0
            })

            newCat.save().then((cat) => {
                user.catsOwned.push(cat)
                user.save().then((result) => {
                    return res.send({ user: user, cat: cat })
                }, (error) => {
                    res.status(400).send(error) // 400 for bad request
                })
            }, (error) => {
                res.status(400).send(cat)
            })

        }
    }).catch((error) => {
        log(error)
        res.status(500).send()
        return
    })
})

app.get('/cat', (req, res) => {
    models.Cat.find().then((cats) => {
        return res.send(cats) // can wrap in object if want to add more properties
    }, (error) => {
        res.status(500).send(error) // server error
    })
})

app.get('/cat/:userid', (req, res) => {
    const userid = mongoose.Types.ObjectId(req.params.userid)
    if (!ObjectID.isValid(userid)) {
        res.status(404).send()
        return
    }
    models.User.findById(userid).then((user) => {
        // can wrap in object if want to add more properties
        models.Cat.find({ owner: user }).then((cats) => {
            return res.send(cats)
        }, (error) => {
            res.status(500).send(error) // server error
        })
    }, (error) => {
        res.status(500).send(error) // server error
    })
})


app.get('/cat/:userid/:catid', (req, res) => {
    /// req.params has the wildcard parameters in the url, in this case, id.
    // log(req.params.id)
    const userid = mongoose.Types.ObjectId(req.params.userid)
    if (!ObjectID.isValid(userid)) {
        res.status(404).send()
        return
    }
    const catid = mongoose.Types.ObjectId(req.params.catid)
    if (!ObjectID.isValid(catid)) {
        res.status(404).send()
        return
    }
    models.User.findById(userid).then((user) => {
        if (!user) {
            res.status(404).send() // could not find this student
        } else {
            /// sometimes we wrap returned object in another object:
            models.Cat.findById(catid).then((cat) => {
                return res.send({ user: user, cat: cat })
            }, (error) => {
                res.status(500).send(error) // server error
            })
        }
        // can wrap in object if want to add more properties
    }, (error) => {
        res.status(500).send(error) // server error
    })

})

app.delete('/cat/:userid/:catid', (req, res) => {

    const userid = mongoose.Types.ObjectId(req.params.userid)
    if (!ObjectID.isValid(userid)) {
        res.status(404).send()
        return
    }
    const catid = mongoose.Types.ObjectId(req.params.catid)
    if (!ObjectID.isValid(catid)) {
        res.status(404).send()
        return
    }
    models.User.findById(userid).then((user) => {
        if (!user) {
            res.status(404).send() // could not find this student
        } else {
            user.catsOwned.splice(user.catsOwned.map(x => {
                    return x.Id;
                }).indexOf(catid), 1)
                /// sometimes we wrap returned object in another object:
            user.save().then((result) => {
                models.Cat.findByIdAndDelete(catid).then((cat) => {
                    if (!cat) {
                        res.status(404).send()
                    } else {
                        return res.send({ user: user, cat: cat })
                    }
                }).catch((error) => {
                    res.status(500).send()
                })
            }, (error) => {
                res.status(400).send(error) // 400 for bad request
            })

        }
    }).catch((error) => {
        res.status(500).send() // server error
    })
})

// name, birthday, gender, bio, photos
app.patch('/cat/:userid/:catid', (req, res) => {

    const userid = mongoose.Types.ObjectId(req.params.userid)
    if (!ObjectID.isValid(userid)) {
        console.log("invalid userid")
        res.status(404).send()
        return
    }
    const catid = mongoose.Types.ObjectId(req.params.catid)
    if (!ObjectID.isValid(catid)) {
        console.log("invalid catrid")
        res.status(404).send()
        return
    }
    models.User.findById(userid).then((user) => {
        if (!user) {
            res.status(404).send()
            console.log("cant find user")
        } else {
            models.Cat.findById(catid).then((cat) => {
                if (!cat) {
                    res.status(404).send()
                    console.log("cant find cat")
                } else {
                    cat.owner = req.body.owner == null ? cat.owner : req.body.owner;
                    cat.name = req.body.name == null ? cat.name : req.body.name;
                    cat.photos = req.body.photos == null ? cat.photos : req.body.photos;
                    cat.birthday = req.body.birthday == null ? cat.birthday : req.body.birthday;
                    cat.gender = req.body.gender == null ? cat.gender : req.body.gender;
                    cat.bio = req.body.bio == null ? cat.bio : req.body.bio;
                    cat.likes = req.body.likes == null ? cat.likes : req.body.likes;
                    cat.dislikes = req.body.dislikes == null ? cat.dislikes : req.body.dislikes;
                    cat.likedUsers = req.body.likedUsers == null ? cat.likedUsers : req.body.likedUsers;
                    cat.dislikedUsers = req.body.dislikedUsers == null ? cat.dislikedUsers : req.body.dislikedUsers;
                    cat.reports = req.body.reports == null ? cat.reports : req.body.reports;
                    cat.save().then((result) => {
                        return res.send({ user: user, cat: cat })
                    }, (error) => {
                        res.status(400).send(error) // 400 for bad request
                    })

                }

            })

        }
    })

})

// Image API
// The code bellow as well as the model for Image was taken from
// the example provided by the instructors:
// https://github.com/csc309-winter-2020/cloudinary-mongoose-react

// a POST route to *create* an image
app.post("/images", multipartMiddleware, (req, res) => {
    cloudinary.uploader.upload(
        req.files.image.path,
        function(result) {

            var img = new models.Image({
                image_id: result.public_id,
                image_url: result.url,
                created_at: new Date(),
            });

            img.save().then(
                saveRes => {
                    res.send(saveRes);
                },
                error => {
                    res.status(400).send(error);
                }
            );
        });
});

// a GET route to get all images
app.get("/images", (req, res) => {
    models.Image.find().then(
        images => {
            res.send({ images });
        },
        error => {
            res.status(500).send(error);
        }
    );
});

/// a DELETE route to remove an image by its id.
app.delete("/images/:imageId", (req, res) => {
    const imageId = req.params.imageId;

    cloudinary.uploader.destroy(imageId, function(result) {

        models.Image.findOneAndRemove({ image_id: imageId })
            .then(img => {
                if (!img) {
                    res.status(404).send();
                } else {
                    res.send(img);
                }
            })
            .catch(error => {
                res.status(500).send();
            });
    });
});

/*** Webpage routes below **********************************/

// All routes other than above will go to index.html
app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
});

const port = process.env.PORT || 5000
app.listen(port, () => {
    log(`Listening on port ${port}...`)
});