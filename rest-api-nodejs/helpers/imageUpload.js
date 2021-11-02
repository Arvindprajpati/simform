const moment = require('moment');

var AWS = require('aws-sdk');



function upload(req, callback) {

    AWS
        .config
        .update({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            region: process.env.REGION
        });

    //AWS.config.credentials = credentials;
    const s3 = new AWS.S3();
    // Binary data base64
    const fileContent = Buffer.from(req.files.profile.data, 'binary');

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.BUKET_NAME,
        Key: `${ moment().unix()}.jpg`, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        callback(data.Location);
    });
}

module.exports = {
    upload: upload
}