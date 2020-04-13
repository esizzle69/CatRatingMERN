const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    location: String,
    email: String,
    photo: String,
    reports: Number,
    catsOwned: [{ type: Schema.Types.ObjectId, ref: 'Cat' }],
    catsLiked: [{ type: Schema.Types.ObjectId, ref: 'Cat' }],
    catsVoted: [{ type: Schema.Types.ObjectId, ref: 'Cat' }]
});

const CatSchema = new mongoose.Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    photos: [String],
    birthday: String,
    gender: String,
    bio: String,
    likes: Number,
    dislikes: Number,
    likedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dislikedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    reports: Number
});

// Taken from https://github.com/csc309-winter-2020/cloudinary-mongoose-react
const imageSchema = mongoose.Schema({
    image_id: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    created_at: String
});

const Cat = mongoose.model('Cat', CatSchema);
const User = mongoose.model('User', UserSchema);
const Image = mongoose.model('Image', imageSchema);

module.exports = { Cat: Cat, User: User, Image: Image };