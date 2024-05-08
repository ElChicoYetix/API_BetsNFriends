"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = void 0;
// src/middlewares/google-auth.ts
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_1 = __importDefault(require("../models/user"));
const express_session_1 = __importDefault(require("express-session"));
const googleAuth = (app) => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, cb) => {
        try {
            // Encuentra o crea el usuario
            let user = await user_1.default.findOne({ googleId: profile.id });
            if (!user) {
                user = new user_1.default({
                    googleId: profile.id,
                    usuario: profile.displayName,
                    email: profile.emails?.[0]?.value, // Primer correo
                    imageUrl: profile.photos?.[0]?.value, // Primera foto
                });
                await user.save();
            }
            cb(null, user);
        }
        catch (error) {
            cb(error);
        }
    }));
    passport_1.default.serializeUser((user, cb) => {
        cb(null, user._id);
    });
    passport_1.default.deserializeUser(async (id, cb) => {
        try {
            const user = await user_1.default.findById(id);
            console.log("Deserialized User:", user); // Verificar el objeto del usuario
            cb(null, user);
        }
        catch (error) {
            cb(error);
        }
    });
    app.use((0, express_session_1.default)({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SECRET_KEY,
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
};
exports.googleAuth = googleAuth;
