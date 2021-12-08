// const express = require('express');
// const {RtcTokenBuilder, RtcRole} =  require('agora-access-token');

// const PORT = 8080;

// const APP_ID = process.env.APP_ID;
// const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

// const app = express();

// const nocache = (req, resp, next) => {
//     resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     resp.header('Expires', '-1');
//     resp.header('Pragma', 'no-cache');
//     next();
// }

// const generateAccessToken = (req, resp) => {
//     // set header
//     resp.header('Access-Control-Allow-Origin', '*');

//     //  Channel Name
//     const channelName = req.query.channelName;
//     if(!channelName){
//         return resp.status(500).json({'error': 'channel is required'});
//     }

//     //  get uid
//     let uid = req.query.uid;
//     if(!uid || uid == ''){
//         uid = 0;
//     }

//     //  get role
//     let role = RtcRole.SUBSCRIBER;
//     if(req.query.role == 'publisher'){
//         role = RtcRole.PUBLISHER;
//     }

//     //  expire time
//     let expireTime = req.query.expireTime;
//     if(!expireTime || expireTime == ''){
//         expireTime == 3600;
//     }
//     else{
//         expireTime = parseInt(expireTime, 10);
//     }


//     // calculate time
//     const currentTime = Math.floor(Date.now() / 1000);
//     const privilegeExpireTime = currentTime + expireTime;


//     //  build token
//     const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);

//     // return the token
//     return resp.json({'token': token});

// }

// app.get('/access_token', nocache, generateAccessToken);

// app.listen(PORT, () => {
//     console.log('Listening on: ${PORT}' );
// });


const express = require("express");
const Agora = require("agora-access-token");

const app = express();
app.use(express.json());

app.post("/rtctoken", (req, res) => {
  const appID = "64ecec133d69451a91cd78531fd3f869  ";
  const appCertificate = "38e4e5b25a2748928640d86ab4ebd4e4";
  const expirationTimeInSeconds = 3600;
  const uid = Math.floor(Math.random() * 100000);
  const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
  const channel = req.body.channel;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;

  const token = Agora.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, uid, role, expirationTimestamp);
  res.send({ uid, token });
});

app.post("/rtmtoken", (req, res) => {
  const appID = "64ecec133d69451a91cd78531fd3f869";
  const appCertificate = "38e4e5b25a2748928640d86ab4ebd4e4";
  const user = req.body.user;
  const role = Agora.RtmRole.Rtm_User;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;

  const token = Agora.RtmTokenBuilder.buildToken(appID, appCertificate, user, role, expirationTimestamp);
  res.send({ token });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Agora Auth Token Server listening at Port ${port}`));