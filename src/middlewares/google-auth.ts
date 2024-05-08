// src/middlewares/google-auth.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user';
import { IUser } from '../models/user';
import session from 'express-session';
import { Application } from 'express';

export const googleAuth = (app: Application) => {
    passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
          },
          async (accessToken, refreshToken, profile, cb) => {
            try {
                // Encuentra o crea el usuario
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        usuario: profile.displayName,
                        email: profile.emails?.[0]?.value, // Primer correo
                        imageUrl: profile.photos?.[0]?.value, // Primera foto
                    });

                    await user.save();
                }

                cb(null, user);
            } catch (error) {
                cb(error as string);
            }
          }
        )
    );
    
    passport.serializeUser((user, cb) => {
        cb(null, (user as IUser)._id); 
    });

    passport.deserializeUser(async (id, cb) => {
        try {
            const user = await User.findById(id);
            console.log("Deserialized User:", user); // Verificar el objeto del usuario
            cb(null, user);
        } catch (error) {
            cb(error);
        }
    });

    app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SECRET_KEY!,
    }));

    app.use(passport.initialize());
    app.use(passport.session());
};
