Dimelo Source SDK base implementation
===================

You will find the minimum requirements in order to implement a Dimelo Source SDK:
> - implementation.info
> - Response signature and request signature check
> - Base actions (show, list)

------------

Table of contents
-------------
[TOC]

------------

Development setup
----------------

1. Clone the repo: `git clone git@github.com:DrissTM/source-sdk-base-implementation.git`
2. Install the app: `npm install`
3. Set your Dimelo Secret as an environment variable: `export DIMELO_SECRET_KEY="YOUR_SECRET_KEY"`
4. Start the app: `npm start`
5. You can now send post request on `localhost:3000`

If you want to bypass the signature check you can add a `NO_SIGN_CHECK` environment variable:
> `export NO_SIGN_CHECK="ANY_VALUE_YOU_WANT"`

Its value won't be used, you can use whatever you want. 
