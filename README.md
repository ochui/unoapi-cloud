<div align="center">

[![Whatsapp Group](https://img.shields.io/badge/Group-WhatsApp-%2322BC18)](https://chat.whatsapp.com/CRBaGd850uB1QigKRcguJU)
[![License](https://img.shields.io/badge/license-GPL--3.0-orange)](./LICENSE)
[![Support](https://img.shields.io/badge/Donation-picpay-green)](https://app.picpay.com/user/clairton.rodrigo)
[![Support](https://img.shields.io/badge/Buy%20me-coffe-orange)](https://www.buymeacoffee.com/clairton)

</div>
<h1 align="center">Unoapi Cloud</h1>

An implementation of Baileys(`https://github.com/WhiskeySockets/Baileys`) as
RESTful API service with multi device support with a Whatsapp Cloud API format
`https://developers.facebook.com/docs/whatsapp/cloud-api`.

The media files are saved in file system at folder data with the session or in redis.

## Send a Message

The payload is based on
`https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components#messages-object`

To send a message

```sh
curl -i -X POST \
http://localhost:9876/v15.0/5549988290955/messages \
-H 'Content-Type: application/json' \
-d '{ 
  "messaging_product": "whatsapp", 
  "to": "5549988290955", 
  "type": "text", 
  "text": { 
    "body": "hello" 
  } 
}'
```

To send a message to group

```sh
curl -i -X POST \
http://localhost:9876/v15.0/5549988290955/messages \
-H 'Content-Type: application/json' \
-d '{ 
  "messaging_product": "whatsapp", 
  "to": "120363040468224422@g.us", 
  "type": "text", 
  "text": { 
    "body": "hello" 
  } 
}'
```

## Media

To test media

```sh
curl -i -X GET \
http://localhost:9876/v15.0/5549988290955/3EB005A626251D50D4E4 \
-H 'Content-Type: application/json'
```

This return de url and request this url like

```sh
curl -i -X GET \
http://locahost:9876/download/v13/5549988290955/5549988290955@s.whatsapp.net/48e6bcd09a9111eda528c117789f8b62.png \
-H 'Content-Type: application/json'
```

To send media

`https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#media-messages`

```sh
curl -i -X POST \
http://localhost:9876/v15.0/5549988290955/messages \
-H 'Content-Type: application/json' \
-d '{ 
  "messaging_product": "whatsapp", 
  "to": "5549988290955", 
  "type": "image", 
  "image": {
    "link" : "https://github.githubassets.com/favicons/favicon-dark.png"
  }
}'
```

## Webhook Events

Webhook Events like this
https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples

Message status update on this
https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#message-status-updates

To turn possible work with group, we add three fields(group_id, group_subject and group_picture) in
message beside cloud api format if `IGNORE_GROUP_MESSAGES` is `false`. Unoapi put field` picture` in profile.

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [{
          "value": {
              "messaging_product": "whatsapp",
              "metadata": {
                  "display_phone_number": PHONE_NUMBER,
                  "phone_number_id": PHONE_NUMBER_ID
              },
              "contacts": [{
                  "profile": {
                    "name": "NAME",
                    "picture": "url of image" // extra field of whatsapp cloud api oficial
                  },
                  "group_id": "123345@g.us", // extra field of whatsapp cloud api oficial
                  "group_subject": "Awesome Group", // extra field of whatsapp cloud api oficial
                  "group_picture": "url of image", // extra field of whatsapp cloud api oficial
                  "wa_id": PHONE_NUMBER
                }],
              "messages": [{
                  "from": PHONE_NUMBER,
                  "id": "wamid.ID",
                  "timestamp": TIMESTAMP,
                  "text": {
                    "body": "MESSAGE_BODY"
                  },
                  "type": "text"
                }]
          },
          "field": "messages"
        }]
  }]
}
```

## Error Messages

Messages failed with this
`https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#status--message-failed`

Custom errors sound append this codes
`https://developers.facebook.com/docs/whatsapp/cloud-api/support/error-codes`
with:

* 1 - unknown erro, verify logs for error details
* 2 - the receipt number not has whatsapp account
* 3 - disconnect number, please read qr code
* 4 - Unknown baileys status
* 5 - Wait a moment, connecting process 
* 6 - max qrcode generate 
* 7 - invalid phone number
* 8 - message not allowed
* 9 - connection lost

## Up for development

Copy .env.example to .env an set your config

A `docker-compose.yml` file is available:

```sh
docker compose up
```

Visit `http://localhost:9876/ping` wil be render a "pong!"


## Up for production

A `docker-compose.yml` example for production:

```yml
version: '3'

services:
  app:
    image: clairton/unoapi-cloud:latest
    volumes:
      - ./data:/home/u/app/data
    ports:
      - 9876:9876
    deploy:
      restart_policy:
        condition: on-failure
```

Run `docker compose up`

Visit `http://localhost:9876/ping` wil be render a "pong!"

## Start options

`yarn start` up a single server and save session and media file in filesystem

`yarn cloud` up a single server and save message in redis and message broker rabbitmq

`yarn web` e `yarn worker` up a web and worker with redis and rabbitmq


## Config Options
### Config with Environment Variables

Create a `.env`file and put configuration if you need change default value:

| Parameter                     | Default         | Description                                                                                                     |
|-------------------------------|-----------------|-----------------------------------------------------------------------------------------------------------------|
| WEBHOOK_URL_ABSOLUTE          |                 | The absolute URL of the webhook. Do not use this if WEBHOOK_URL is already in use.                              |
| WEBHOOK_URL                   |                 | The webhook URL. This configuration attribute appends the phone number at the end. Do not use if WEBHOOK_URL_ABSOLUTE is in use. |
| WEBHOOK_TOKEN                 |                 | The token for the webhook header.                                                                               |
| WEBHOOK_HEADER                |                 | The name of the webhook header.                                                                                 |
| WEBHOOK_SESSION               |                 | Webhook used to send events of types OnStatus and OnQrCode.                                                     |
| WEBHOOK_TIMEOUT_MS            | 5000            | The timeout for webhook requests, in milliseconds.                                                              |
| WEBHOOK_SEND_NEW_MESSAGES     | false           | If true, sends new messages to the webhook. Be cautious, as messages may be duplicated.                         |
| BASE_URL                      |                 | The current base URL to download media.                                                                         |
| PORT                          |                 | The HTTP port.                                                                                                  |
| IGNORE_GROUP_MESSAGES         | true            | If false, sends group messages received in the socket to the webhook.                                           |
| IGNORE_BROADCAST_STATUSES     | true            | If false, sends broadcast stories received in the socket to the webhook.                                        |
| IGNORE_STATUS_MESSAGE         | true            | If false, sends status messages received in the socket to the webhook.                                          |
| IGNORE_BROADCAST_MESSAGES     | false           | If false, sends broadcast messages received in the socket to the webhook.                                       |
| IGNORE_HISTORY_MESSAGES       | true            | If false, imports messages when connecting.                                                                     |
| IGNORE_OWN_MESSAGES           | true            | If false, sends own messages received in the socket to the webhook.                                             |
| IGNORE_YOURSELF_MESSAGES      | true            | If true, ignores messages sent to yourself to avoid potential loops.                                            |
| COMPOSING_MESSAGE             | false           | If true, enables the display of a composing indicator before sending a message based on text length.           |
| REJECT_CALLS                  |                 | The message to send when receiving a call. By default, calls are not rejected if this is empty.                 |
| REJECT_CALLS_WEBHOOK          |                 | Deprecated. Use MESSAGE_CALLS_WEBHOOK instead.                                                                  |
| MESSAGE_CALLS_WEBHOOK         |                 | The message to send to the webhook when receiving a call. By default, no message is sent if this is empty.      |
| SEND_CONNECTION_STATUS        | true            | If true, sends all connection statuses to the webhook. If false, only important messages are sent.              |
| BASE_STORE                    | ./data          | The directory where sessions, media, and stores are saved.                                                      |
| IGNORE_DATA_STORE             |                 | If set, ignores saving and retrieving data (messages, contacts, groups, etc.).                                  |
| AUTO_CONNECT                  | true            | If true, automatically connects on service start.                                                               |
| AUTO_RESTART_MS               | 0               | The time in milliseconds to wait before restarting the connection. By default, auto-restart is disabled.        |
| THROW_WEBHOOK_ERROR           | false           | If true, sends webhook errors to self on WhatsApp and throws an exception.                                      |
| NOTIFY_FAILED_MESSAGES        | true            | If true, sends a message to yourself on WhatsApp when a message fails and is enqueued in the dead queue.        |
| LOG_LEVEL                     | warn            | The log level.                                                                                                  |
| UNO_LOG_LEVEL                 | LOG_LEVEL       | The log level for Uno. By default, it is the same as LOG_LEVEL.                                                 |
| SEND_REACTION_AS_REPLY        | false           | If true, sends reactions as a reply.                                                                            |
| SEND_PROFILE_PICTURE          | true            | If true, sends the profile pictures of users and groups.                                                        |
| UNOAPI_RETRY_REQUEST_DELAY_MS | 1000            | The delay in milliseconds to retry a request when decryption fails. By default, it is set to one second.        |
| PROXY_URL                     |                 | The SOCKS proxy URL. By default, no proxy is used.                                                              |
| CLEAN_CONFIG_ON_DISCONNECT    | false           | If true, clears all saved Redis configurations upon disconnecting a number.                                     |


Bucket env to config assets media compatible with S3, this config can't save in redis:

```env
STORAGE_BUCKET_NAME
STORAGE_ACCESS_KEY_ID
STORAGE_SECRET_ACCESS_KEY
STORAGE_REGION
STORAGE_ENDPOINT
STORAGE_FORCE_PATH_STYLE
```

Config connection to redis to temp save messages and rabbitmq broker, this config can't save in redis too.

```env
AMQP_URL
REDIS_URL
```

### Config with redis

The `.env` can be save one configm, but on redis use different webhook by session number, to do this, save the config json with key format `unoapi-config:XXX`, where XXX is your whatsapp number.

```json
{
  "authToken": "xpto",
  "rejectCalls":"Reject Call Text do send do number calling to you",
  "rejectCallsWebhook":"Message send to webhook when receive a call",
  "ignoreGroupMessages": true,
  "ignoreBroadcastStatuses": true,
  "ignoreBroadcastMessages": false,
  "ignoreHistoryMessages": true,
  "ignoreOwnMessages": true,
  "ignoreYourselfMessages": true,
  "sendConnectionStatus": true,
  "composingMessage": false,
  "sessionWebhook": "",
  "autoConnect": false,
  "autoRestartMs": 3600000,
  "retryRequestDelayMs": 1000,
  "throwWebhookError": false,
  "webhooks": [
    {
      "url": "http://localhost:3000/whatsapp/webhook",
      "token": "kslflkhlkwq",
      "header": "api_acess_token"
    }
  ],
  "ignoreDataStore": false
}
```

PS: After update JSON, restart de docker container or service


### Save config with http

To create a session with http send a post with config in body to `http://localhost:9876/v15.0/:phone/register`, change :phone by your phone session number and put content of env UNOAPI_AUTH_TOKEN in Authorization header:

```sh
curl -i -X POST \
http://localhost:9876/v17.0/5549988290955/register \
-H 'Content-Type: application/json' \
-H 'Authorization: 1' \
-d '{ 
  "ignoreOwnMessages": false
}'
```

### Delete config and session with http

To remover a session with http send a post to `http://localhost:9876/v15.0/:phone/deregister`, change :phone by your phone session number and put content of env UNOAPI_AUTH_TOKEN in Authorization header:

```sh
curl -i -X POST \
http://localhost:9876/v17.0/5549988290955/deregister \
-H 'Content-Type: application/json' \
-H 'Authorization: 1' 
```

### Get a session config

```sh
curl -i -X GET \
http://localhost:9876/v15.0/5549988290955 \
-H 'Content-Type: application/json' \
-H 'Authorization: 1'
```

### List the sessions configs

```sh
curl -i -X GET \
http://localhost:9876/v15.0/phone_numbers \
-H 'Content-Type: application/json' \
-H 'Authorization: 1'
```

```json
{
  "authToken": "xpto",
  "rejectCalls":"Reject Call Text do send do number calling to you",
  "rejectCallsWebhook":"Message send to webhook when receive a call",
  "ignoreGroupMessages": true,
  "ignoreBroadcastStatuses": true,
  "ignoreBroadcastMessages": false,
  "ignoreHistoryMessages": true,
  "ignoreOwnMessages": true,
  "ignoreYourselfMessages": true,
  "sendConnectionStatus": true,
  "composingMessage": false,
  "sessionWebhook": "",
  "autoConnect": false,
  "autoRestartMs": 3600000,
  "retryRequestDelayMs": 1000,
  "throwWebhookError": false,
  "webhooks": [
    {
      "url": "http://localhost:3000/whatsapp/webhook",
      "token": "kslflkhlkwq",
      "header": "api_acess_token"
    }
  ],
  "ignoreDataStore": false
}
```

## Templates

The templates will be customized, saving in `${BASE_STORE}/${PHONE_NUMBER}/templates.json` , or when use redis with key `unoapi-template:${PHONE_NUMBER}`. The json format is:

```json
[
  {
    "id": 1,
    "name": "hello",
    "status": "APPROVED",
    "category": "UTILITY",
    "components": [
      {
        "text": "{{hello}}",
        "type": "BODY",
        "parameters": [
          {
            "type": "text",
            "text": "hello",
          },
        ],
      },
    ],
  }
]
```

PS: After update JSON, restart de docker container or service


## Examples

### [Docker compose with chatwoot](examples/chatwoot/README.md)

### [Docker compose with unoapi](examples/docker-compose.yml)

### [Docker compose with chatwoot and unoapi together](examples/unochat/README.md)

### [Typebot](examples/typebot/README.md)

## Install as Systemctl

Install nodejs 21 as https://nodejs.org/en/download/package-manager and Git

`mkdir /opt/unoapi && cd /opt/unoapi`

`git clone git@github.com:clairton/unoapi-cloud.git .`

`npm install`

`npm build`

`cp .env.example .env && vi .env`

```env
WEBHOOK_URL=http://chatwoot_addres/webhooks/whatsapp
WEBHOOK_TOKEN=chatwoot token
BASE_URL=https://unoapi_address
BASE_STORE=/opt/unoapi/data
WEBHOOK_HEADER=api_access_token
```

And other .env you desire

`chown -R $(whoami) ./data/sessions && chown -R $(whoami) ./data/stores && chown -R $(whoami) ./data/medias`

`vi /etc/systemd/system/unoapi.service` or `systemctl edit --force --full unoapi.service`

And put

```
[Unit]
Description=Unoapi
ConditionPathExists=/opt/unoapi/data
After=network.target
  
[Service]
ExecStart=/usr/bin/node dist/index.js
WorkingDirectory=/opt/unoapi
CPUAccounting=yes
MemoryAccounting=yes
Type=simple
Restart=on-failure
TimeoutStopSec=5
RestartSec=5

[Install]  
WantedBy=multi-user.target
```
Run

`systemctl daemon-reload && systemctl enable unoapi.service && systemctl start unoapi.service`

To show logs `journalctl -u unoapi.service -f`

## Postman collection

[![Postman Collection](https://img.shields.io/badge/Postman-Collection-orange)](https://www.postman.com/clairtonrodrigo/workspace/unoapi/collection/2340422-8951a202-9a18-42ea-b6be-42f57b4d768d?tab=variables)

## Caution with whatsapp web connection
More then 14 days without open app in smartphone, the connection with whatsapp web is invalidated and need to read a new qrcode.

## Legal

- This code is in no way affiliated, authorized, maintained, sponsored or
  endorsed by WA (WhatsApp) or any of its affiliates or subsidiaries.
- The official WhatsApp website can be found at https://whatsapp.com. "WhatsApp"
  as well as related names, marks, emblems and images are registered trademarks
  of their respective owners.
- This is an independent and unofficial software Use at your own risk.
- Do not spam people with this.

## Note

I can't guarantee or can be held responsible if you get blocked or banned by
using this software. WhatsApp does not allow bots using unofficial methods on
their platform, so this shouldn't be considered totally safe.

Released under the GPLv3 License.

## WhatsApp Group

https://chat.whatsapp.com/FZd0JyPVMLq94FHf59I8HU

## Need More

Mail to comercial@unoapi.cloud

## Donate to the project.

#### Pix: 0e42d192-f4d6-4672-810b-41d69eba336e

</br>

#### PicPay

<div align="center">
  <a href="https://app.picpay.com/user/clairton.rodrigo" target="_blank" rel="noopener noreferrer">
    <img src="./picpay.png" style="width: 50% !important;">
  </a>
</div>

</br>

### Buy Me A Coffee

<div align="center">
  <a href="https://www.buymeacoffee.com/clairton" target="_blank" rel="noopener noreferrer">
    <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" style="width: 50% !important;">
  </a>
</div>

</br>
