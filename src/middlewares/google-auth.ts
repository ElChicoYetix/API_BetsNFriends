import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user';
import { IUser } from '../models/user'; // Asegúrate de importar el tipo correcto
import session from 'express-session';
import { Application } from 'express';

export const googleAuth = (app: Application) => {
    passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
          },
          async (accessToken, refreshToken, profile, cb) => {
            try {
                // Encuentra o crea el usuario
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails?.[0]?.value, // Primer correo
                    });

                    await user.save();
                }

                cb(null, user);
            } catch (error) {
                cb(error);
            }
          }
        )
    );

    passport.serializeUser((user: IUser, cb) => {
        cb(null, user._id); // Serializa por ID
    });

    passport.deserializeUser(async (id, cb) => {
        try {
            const user = await User.findById(id);
            cb(null, user); // Devuelve el usuario encontrado
        } catch (error) {
            cb(error);
        }
    });

    app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SECRET_KEY,
    }));

    app.use(passport.initialize());
    app.use(passport.session());
};
