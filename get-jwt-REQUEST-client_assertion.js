// library npm and read certificate file fs 
var jwt = require('jsonwebtoken');
var fs = require('fs');
var request = require('request');
var certificatefile = fs.readFileSync('path-certificate');

// Fingerprint your certificate
// echo $(openssl x509 -in yourcertificate.pem -fingerprint -noout) | sed 's/SHA1 Fingerprint=//g' | sed 's/://g' | xxd -r -ps | base64
var Headers = {
   "x5t":"Fingerprint"
}

// Create object with tenantid and clientid 
var current = Date.now().toString().substr(0,10);
var JWT = {
   "aud": "https://login.microsoftonline.com/<TenantID>/oauth2/token",
   "iss": "<client-Id>",
   "sub": "<client-id>",
   "jti": "" + Math.random(),
   "nbf": Number(current),
   "exp": Number(current)+3600
};

// Create JWT sign with certificate
var jwtsign = jwt.sign(JWT,
                      { key: certificatefile, passphrase: 'P@ssword123' },
                      {algorithm:'RS256', header:Headers}
                    );
console.log(jwtsign);

// Get jwt service principal with certificate in azure ad 'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
var options = {
  'method': 'POST',
  'url': 'https://login.microsoftonline.com/<TenantID>/oauth2/v2.0/token',
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  form: {
    'client_id': '<client-Id>',
    'scope': 'api://<scope>/.default',
    'grant_type': 'client_credentials',
    'client_assertion': jwtsign,
    'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
  }
};

request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
