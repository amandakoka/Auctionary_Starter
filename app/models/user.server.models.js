const db = require("../../database")
const crypto = require("crypto");

// Creates and returns a hash of the password/salt as hex salt
const getHash = function(password, salt){
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
}

/**
 * Creates random salt hashes password using getHash function
 * Insert new user info into users table
 * @param {*} user 
 * @param {*} done 
 */
const addNewUser = (user, done) => {
    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);
    let values = [user.first_name, user.last_name, user.email, hash, salt.toString('hex')];
   
    db.run(
        `INSERT INTO users (first_name, last_name, email, password, salt) VALUES (?,?,?,?,?)`,
        values, 
        function(err) {
            if(err){
                console.log(err);
                return done(err);
            }
            return done(err, this.lastID)
    })
}

/**
 * Gets the user record from db, checks email(username) and password salt
 * Passes incoming password/salt from db to th getHash function
 * Checks the generated hash is same as the db hash
 * @param {*} email 
 * @param {*} password 
 * @param {*} done 
 */
const authenticateUser = (email, password, done) => {
    const sql = `SELECT user_id, password, salt FROM users WHERE email=?`
    db.get(sql, [email], (err, row) => {
        if(err) return done(err);
        if(!row) return done(404);

        if(row.salt === null) row.salt = '';

        let salt = Buffer.from(row.salt, 'hex');

        if (row.password === getHash(password,salt)) {
            return done(false, row.user_id);
        } else {
            return done(404);
        }
    })
}

const getToken = ( id, done) => {
    db.get(
        `SELECT session_token FROM users WHERE user_id=?`,
         [id],
        function (err, row){
            if (row && row.user_token){
                return done(null, row,user_token)
            } else {
                return done(null, null)
            }
        })

}

const setToken = ( id, done) => {
    let token = crypto.randomBytes(16).toString('hex');

    const sql = `UPDATE users SET session_token=? WHERE user_id=?`;
    db.run(sql, [token, id], (err) => {
        return done(err, token)
    })
}

const removeToken = (Token, done) => {
    const sql = `UPDATE users SET session_token=NULL WHERE session_token=?`;

    db.run(sql, [Token], (err) => {
        return done(err);
    })

}
/**
 * Checks token is valid and gets the user id where the token matches incoming token
 * @param {*} Token 
 * @param {*} done 
 * @returns 
 */
const getIDFromToken = (Token, done) => {
    if (token === undefined || token === null)
        return done(true, null);
    else {
        db.get(
            `SELECT user_id FROM users WHERE session_token=?`,
                [Token],
                function (err, row){
                    if (row) 
                        return done(null, row.user_id);
                    return done(err, null);
              }
        )
    }
}

module.exports = {
    addNewUser: addNewUser,
    authenticateUser: authenticateUser,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    getIDFromToken: getIDFromToken
}



