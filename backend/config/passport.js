const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./database');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Kiểm tra xem người dùng đã tồn tại chưa
      const [users] = await db.query(
        'SELECT * FROM nguoi_dung WHERE google_id = ?',
        [profile.id]
      );

      if (users.length > 0) {
        // Người dùng đã tồn tại
        return done(null, users[0]);
      } else {
        // Tạo người dùng mới (chưa có hồ sơ)
        const [result] = await db.query(
          `INSERT INTO nguoi_dung (email, google_id, loai_nguoi_dung, trang_thai) 
           VALUES (?, ?, 'sinh_vien', 'chua_hoan_thanh')`,
          [profile.emails[0].value, profile.id]
        );

        const newUser = {
          id: result.insertId,
          email: profile.emails[0].value,
          google_id: profile.id,
          loai_nguoi_dung: 'sinh_vien',
          trang_thai: 'chua_hoan_thanh'
        };

        return done(null, newUser);
      }
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [users] = await db.query('SELECT * FROM nguoi_dung WHERE id = ?', [id]);
    done(null, users[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
