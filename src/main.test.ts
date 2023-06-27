import { idReplacer } from './main'
// import { v4 as uuid } from 'uuid';

test('greeting', () => {
  const mockGuid = jest.fn().mockImplementationOnce(() => "hello");

  const scriptObj = {
    "40f91429-46ae-96e8-ccd3-5a08f6f61548": {
      "_id": "40f91429-46ae-96e8-ccd3-5a08f6f61548",
      "name": "dis-login-step-2-node",
      "description": "Decision node script used as part of login journey after page 2 is submitted. This uses auth engine to submit secure numbers, password and puts the some fields returned from AE into session",
      "script": "\"var frJava = JavaImporter(\\n  org.forgerock.openam.auth.node.api.Action,\\n  org.forgerock.http.protocol.Request,\\n  org.forgerock.http.protocol.Entity,\\n);\\nvar service = requestParameters.get('authIndexValue').get(0);\\n\\nlogger.error('***' + service + ' login success');\\n\\nvar config = {\\n  secretNumberResponseField: 'secretNumberResponse',\\n  passwordField: 'password',\\n  partialRefreshToken: 'partialRefreshToken',\\n  success: 'success',\\n  failed: 'failed',\\n};\\n\\nvar uri =\\n  'https://tvwgwk0f78.execute-api.eu-west-2.amazonaws.com/dev/authengine/api/v1/authentication_challenges/hlam_client/attempts?cb=' +\\n  Date.now();\\n\\nvar secretNumberResponse = JSON.parse(transientState.get(config.secretNumberResponseField));\\nvar password = transientState.get(config.passwordField);\\nvar partialRefreshToken = sharedState.get(config.partialRefreshToken);\\n\\nlogger.error(\\n  '***' + service + ' secretNumberResponse is ' + JSON.stringify(secretNumberResponse) + 'password is ' + password,\\n);\\n\\nfunction isDigit(input) {\\n  return /^\\\\d$/.test(input);\\n}\\n\\nif ( !isDigit(secretNumberResponse.first) || \\n     !isDigit(secretNumberResponse.second) || \\n     !isDigit(secretNumberResponse.third) ) {\\n  logger.error('***' + service + ' login step 2. failed. invalid number format');\\n  outcome = config.failed;\\n} else {\\n  var request = new frJava.Request();\\n\\n  request.setUri(uri).setMethod('POST');\\n  request.getHeaders().add('Content-Type', 'application/x-www-form-urlencoded');\\n\\n  var body =\\n    'partial_refresh_token=' +\\n    partialRefreshToken +\\n    '&password=' +\\n    encodeURIComponent(password) +\\n    '&secret_char_one=' +\\n    secretNumberResponse.first +\\n    '&secret_char_two=' +\\n    secretNumberResponse.second +\\n    '&secret_char_three=' +\\n    secretNumberResponse.third;\\n\\n  logger.error('***' + service + ' login step 2. auth engine request with ' + body);\\n\\n  request.getEntity().setString(body);\\n\\n  var response = httpClient.send(request).get();\\n\\n  logger.error(\\n    '***' + service + ' login step 1. auth engine response code ' + response.getStatus().code,\\n  );\\n\\n  if (response.getStatus().code === 200) {\\n    var result = response.getEntity().getString();\\n\\n    logger.error('***' + service + ' login step 1. auth engine response ' + result);\\n\\n    var authStep2Resp = JSON.parse(result);\\n\\n    action = frJava.Action.goTo(config.success)\\n      .putSessionProperty('aeClientNumber', authStep2Resp.account_details.client_no)\\n      .putSessionProperty('userName', authStep2Resp.account_details.username)\\n      .putSessionProperty('aeUuid', authStep2Resp.account_details.uuid)\\n      .putSessionProperty('aeAccessToken', authStep2Resp.access_token)\\n      .build();\\n  } else {\\n    logger.error('***' + service + ' login step 2. failed ');\\n    outcome = config.failed;\\n  }\\n}\\n\\n\"",
      "default": false,
      "language": "JAVASCRIPT",
      "context": "AUTHENTICATION_TREE_DECISION_NODE",
      "createdBy": "null",
      "creationDate": 0,
      "lastModifiedBy": "null",
      "lastModifiedDate": 0
    },
    "9a3f379b-2873-dbb1-1871-157f49fd0b35": {
      "_id": "9a3f379b-2873-dbb1-1871-157f49fd0b35",
      "name": "dis-login-step-1-node",
      "description": "Decision node script used as part of login journey after page 1 is submitted. This uses auth engine to submit DoB and username and puts the securenumbers to ask in next step (retrieves from AE response) in shared state",
      "script": "\"var frJava = JavaImporter(org.forgerock.http.protocol.Request, org.forgerock.http.protocol.Entity);\\n\\nvar service = requestParameters.get('authIndexValue').get(0);\\n\\nvar config = {\\n             partialRefreshToken: 'partialRefreshToken',\\n  usernameField: 'username',\\n  dobField: 'dob',\\n  authEngineSecureNumbers: 'authEngineSecureNumbers',\\n  success: 'success',\\n  failed: 'failed',\\n};\\n\\nvar uri =\\n  'https://tvwgwk0f78.execute-api.eu-west-2.amazonaws.com/dev/authengine/api/v1/authentication_challenges/hlam_client/attempts';\\n\\nvar username = nodeState.get(config.usernameField).asString();\\nvar dateOfBirth = sharedState.get(config.dobField);\\n\\nif ( isNaN(dateOfBirth) || dateOfBirth.length>6 ) {\\n  logger.error('***' + service + ' login step 1. failed - invalid dob format');\\n  outcome = config.failed;\\n} else {\\n  var request = new frJava.Request();\\n\\n  request.setUri(uri).setMethod('POST');\\n  request.getHeaders().add('Content-Type', 'application/x-www-form-urlencoded');\\n\\n  // method used in https://gitlab.com/hldev/hlweb/aut/access-manager/-/blob/master/scripts/groovy/tppLoginStepOne.groovy\\n\\n  var body = 'username=' + encodeURIComponent(username) + '&date_of_birth=' + encodeURIComponent(dateOfBirth);\\n  request.getEntity().setString(body);\\n\\n  logger.error('***' + service + ' login step 1. auth engine request with ' + body);\\n\\n  var response = httpClient.send(request).get();\\n\\n  logger.error(\\n    '***' + service + ' login step 1. auth engine response code ' + response.getStatus().code,\\n  );\\n\\n  var secretNumberConfig = {};\\n\\n  if (response.getStatus().code === 200) {\\n    var result = response.getEntity().getString();\\n    logger.error('***' + service + ' login step 1. auth engine response ' + result);\\n\\n    var authStep1Resp = JSON.parse(result);\\n\\n    secretNumberConfig.firstPosition =\\n      authStep1Resp.unsatisfied_requirements.secret_char_position_one;\\n    secretNumberConfig.secondPosition =\\n      authStep1Resp.unsatisfied_requirements.secret_char_position_two;\\n    secretNumberConfig.thirdPosition =\\n      authStep1Resp.unsatisfied_requirements.secret_char_position_three;\\n\\n    sharedState.put(config.authEngineSecureNumbers, JSON.stringify(secretNumberConfig));\\n    sharedState.put(config.partialRefreshToken, authStep1Resp.partial_refresh_token);\\n\\n    logger.error('***' + service + ' login step 1 success.');\\n    outcome = config.success;\\n  } else {\\n    logger.error('***' + service + ' login step 1. failed ');\\n    outcome = config.failed;\\n  }\\n}\\n\\n\\n\"",
      "default": false,
      "language": "JAVASCRIPT",
      "context": "AUTHENTICATION_TREE_DECISION_NODE",
      "createdBy": "null",
      "creationDate": 0,
      "lastModifiedBy": "null",
      "lastModifiedDate": 0
    },
  };

  console.log(scriptObj)
  const result = idReplacer('scriptObj', mockGuid);

  expect(mockGuid).toBeCalledTimes(2);

  expect(result).toBe('hello')
});
