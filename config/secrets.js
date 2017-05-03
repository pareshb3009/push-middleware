/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" API keys and passwords so
 * that all features could work out of the box.
 *
 * Use config vars (environment variables) below for production API keys
 * and passwords. Each PaaS (e.g. Heroku, Nodejitsu, OpenShift, Azure) has a way
 * for you to set it up from the dashboard.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.

 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */

module.exports = {
    db: process.env.MONGODB || 'mongodb://127.0.0.1:27017/illusionpush_middleware',
    apiSecret: process.env.API_SECRET || '123456789123456789',
    timezone: process.env.TIMEZONE || 'Asia/Kolkata',
    // resonatorHost: process.env.RESONATOR || 'http://resonator-dev.ap-south-1.elasticbeanstalk.com'
    resonatorHost: process.env.RESONATOR || 'http://localhost:3006'
};
