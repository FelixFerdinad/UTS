const usersSchema = {
  name: String,
  email: String,
  password: String,
  loginAttempts: {type: Number, default: 0},
  lastFailedAttempt: {type: Date, default: null}
};

module.exports = usersSchema;
