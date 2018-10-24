const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

// to encrypt user
const bcrypt    = require('bcrypt-nodejs');
// built in function crypto(using it to use gavatar)
const crypto    = require('crypto');

// user's schema
const UserSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    contact: String,
    altContact: String,
    picture: String,
    isAdmin: { type: Boolean, default: false },
    isTeacher: { type: Boolean, default: false },
    address: {
        perAddress: String,
        tempAddress: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    created: { type: Date, default: Date.now }
});

// saving the password in hash by passing it to the mongoose pre function
UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    // converting the password to hash
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

// using bcrypt function to compare the user password and the password hash
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// adding user's profile image using gavatar
UserSchema.methods.gravatar = function(size) {
    if (!this.size) size = 200;
    if (!this.email) return `https://gravatar.com/avatar/?s${size}&d=retro`;

    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s${size}&d=retro`;
}

module.exports = mongoose.model('User', UserSchema);