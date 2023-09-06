/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0$3 = require('@bot-whatsapp/bot');
var require$$0$1 = require('axios');
var require$$0$2 = require('node:events');
var require$$1 = require('polka');
var require$$2 = require('body-parser');
var require$$0 = require('crypto');

const crypto = require$$0;

/**
 * Generamos un UUID unico con posibilidad de tener un prefijo
 * @param {*} prefix
 * @returns
 */
const generateRefprovider$1 = (prefix = false) => {
    const id = crypto.randomUUID();
    return prefix ? `${prefix}_${id}` : id
};

var hash = { generateRefprovider: generateRefprovider$1 };

const axios$1 = require$$0$1;

async function getMediaUrl$1(version, IdMedia, numberId, Token) {
    try {
        const response = await axios$1.get(
            `https://graph.facebook.com/${version}/${IdMedia}?phone_number_id=${numberId}`,
            {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
                maxBodyLength: Infinity,
            }
        );
        return response.data?.url
    } catch (error) {
        console.log(error);
    }
}

var utils = {
    getMediaUrl: getMediaUrl$1,
};

const { EventEmitter } = require$$0$2;
const polka = require$$1;
const { urlencoded, json } = require$$2;
const { generateRefprovider } = hash;
const { getMediaUrl } = utils;

let MetaWebHookServer$1 = class MetaWebHookServer extends EventEmitter {
    constructor(jwtToken, numberId, version, token, metaPort = 3000) {
        super();
        this.metaServer = polka();
        this.metaPort = metaPort;
        this.token = token;

        this.jwtToken = jwtToken;
        this.numberId = numberId;
        this.version = version;
        this.buildHTTPServer();
    }

    /**
     * Mensaje entrante
     * emit: 'message'
     * @param {*} req
     * @param {*} res
     */
    incomingMsg = async (req, res) => {
        const { body } = req;
        const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages;

        if (!messages) {
            res.statusCode = 200;
            res.end('empty endpoint');
            return
        }

        const [message] = messages;
        const to = body.entry[0].changes[0].value?.metadata?.display_phone_number;

        if (message.type === 'text') {
            const body = message.text?.body;
            const responseObj = {
                type: message.type,
                from: message.from,
                to,
                body,
            };
            this.emit('message', responseObj);
        }
        
        if (message.type === 'interactive') {
            const body = message.interactive?.button_reply?.title || message.interactive?.list_reply?.id;
            const title_list_reply = message.interactive?.list_reply?.title;
            const responseObj = {
                type: 'interactive',
                from: message.from,
                to,
                body,
                title_list_reply,
            };
            this.emit('message', responseObj);
        }

        if (message.type === 'image') {
            const body = generateRefprovider('_event_image_');
            const idUrl = message.image?.id;
            const resolvedUrl = await getMediaUrl(this.version, idUrl, this.numberId, this.jwtToken);
            const responseObj = {
                type: message.type,
                from: message.from,
                url: resolvedUrl,
                to,
                body,
            };

            this.emit('message', responseObj);
        }

        if (message.type === 'document') {
            const body = generateRefprovider('_event_document_');
            const idUrl = message.document?.id;
            const resolvedUrl = await getMediaUrl(this.version, idUrl, this.numberId, this.jwtToken);
            const responseObj = {
                type: message.type,
                from: message.from,
                url: resolvedUrl, // Utilizar el valor resuelto de la promesa
                to,
                body,
            };

            this.emit('message', responseObj);
        }

        if (message.type === 'video') {
            const body = generateRefprovider('_event_video_');
            const idUrl = message.video?.id;

            const resolvedUrl = await getMediaUrl(this.version, idUrl, this.numberId, this.jwtToken);

            const responseObj = {
                type: message.type,
                from: message.from,
                url: resolvedUrl, // Utilizar el valor resuelto de la promesa
                to,
                body,
            };

            this.emit('message', responseObj);
        }

        if (message.type === 'location') {
            const body = generateRefprovider('_event_location_');

            const responseObj = {
                type: message.type,
                from: message.from,
                to,
                latitude: message.location.latitude,
                longitude: message.location.longitude,
                body,
            };

            this.emit('message', responseObj);
        }

        if (message.type === 'audio') {
            const body = generateRefprovider('_event_audio_');
            const idUrl = message.audio?.id;
            const resolvedUrl = await getMediaUrl(this.version, idUrl, this.numberId, this.jwtToken);
            const responseObj = {
                type: message.type,
                from: message.from,
                url: resolvedUrl, // Utilizar el valor resuelto de la promesa
                to,
                body,
            };

            this.emit('message', responseObj);
        }

        if (message.type === 'sticker') {
            const body = generateRefprovider('_event_sticker_');

            const responseObj = {
                type: message.type,
                from: message.from,
                to,
                id: message.sticker.id,
                body,
            };

            this.emit('message', responseObj);
        }

        if (message.type === 'contacts') {
            const body = generateRefprovider('_event_contacts_');

            const responseObj = {
                type: message.type,
                from: message.from,
                contacts: [{ name: message.contacts[0].name, phones: message.contacts[0].phones }],
                to,
                body,
            };

            this.emit('message', responseObj);
        }

        const json = JSON.stringify({ body });
        res.end(json);
    }

    /**
     * Valida el token
     * @param {string} mode
     * @param {string} token
     * @returns {boolean}
     */
    tokenIsValid(mode, token) {
        return mode === 'subscribe' && this.token === token
    }

    /**
     * Verificación del token
     * @param {*} req
     * @param {*} res
     */
    verifyToken = (req, res) => {
        const { query } = req;
        const mode = query?.['hub.mode'];
        const token = query?.['hub.verify_token'];
        const challenge = query?.['hub.challenge'];

        if (!mode || !token) {
            res.statusCode = 403;
            res.end('No token!');
            return
        }

        if (this.tokenIsValid(mode, token)) {
            console.log('Webhook verified');
            res.statusCode = 200;
            res.end(challenge);
            return
        }

        res.statusCode = 403;
        res.end('Invalid token!');
    }

    emptyCtrl = (_, res) => {
        res.end('');
    }

    /**
     * Contruir HTTP Server
     */
    buildHTTPServer() {
        this.metaServer
            .use(urlencoded({ extended: true }))
            .use(json())
            .get('/', this.emptyCtrl)
            .get('/webhook', this.verifyToken)
            .post('/webhook', this.incomingMsg);
    }

    /**
     * Iniciar el servidor HTTP
     */
    start() {
        this.metaServer.listen(this.metaPort, () => {
            console.log(`[meta]: Agregar esta url "Webhook"`);
            console.log(`[meta]: POST http://localhost:${this.metaPort}/webhook`);
            console.log(`[meta]: Más información en la documentación`);
        });
        this.emit('ready');
    }
};

var server = MetaWebHookServer$1;

const { ProviderClass } = require$$0$3;
const axios = require$$0$1;
const MetaWebHookServer = server;
const URL = `https://graph.facebook.com`;

/**
 * ⚙️MetaProvider: Es un provedor que te ofrece enviar
 * mensaje a Whatsapp via API
 * info: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
 *
 *
 * Necesitas las siguientes tokens y valores
 * { jwtToken, numberId, vendorNumber, verifyToken }
 */
const PORT = process.env.PORT || 3000;

class MetaProvider extends ProviderClass {
    metHook = undefined
    jwtToken = undefined
    numberId = undefined
    version = 'v16.0'

    constructor({ jwtToken, numberId, verifyToken, version, port = PORT }) {
        super();
        this.jwtToken = jwtToken;
        this.numberId = numberId;
        this.version = version;
        this.metHook = new MetaWebHookServer(jwtToken, numberId, version, verifyToken, port);
        this.metHook.start();

        const listEvents = this.busEvents();

        for (const { event, func } of listEvents) {
            this.metHook.on(event, func);
        }
    }

    /**
     * Mapeamos los eventos nativos a los que la clase Provider espera
     * para tener un standar de eventos
     * @returns
     */
    busEvents = () => [
        {
            event: 'auth_failure',
            func: (payload) => this.emit('error', payload),
        },
        {
            event: 'ready',
            func: () => this.emit('ready', true),
        },
        {
            event: 'message',
            func: (payload) => {
                this.emit('message', payload);
            },
        },
    ]

    /**
     * Enviar directo a META
     * @param {*} body
     * @returns
     */
    sendMessageMeta = async (body) => {
        try {
            const response = await axios.post(`${URL}/${this.version}/${this.numberId}/messages`, body, {
                headers: {
                    Authorization: `Bearer ${this.jwtToken}`,
                },
            });
            return response.data
        } catch (error) {
            console.log(error);
            return Promise.resolve(error)
        }
    }

    sendtext = async (number, message) => {
        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'text',
            text: {
                preview_url: false,
                body: message,
            },
        };
        return this.sendMessageMeta(body)
    }

    sendMedia = async (number, _, mediaInput = null) => {
        if (!mediaInput) throw new Error(`MEDIA_INPUT_NULL_: ${mediaInput}`)
        const body = {
            messaging_product: 'whatsapp',
            to: number,
            type: 'image',
            image: {
                link: mediaInput,
            },
        };
        return this.sendMessageMeta(body)
    }

    /**
     * Enviar listas
     * @param {*} number
     * @param {*} text
     * @param {*} buttons
     * @returns
     */
    sendLists = async (number, list) => {
        const parseList = { ...list, ...{ type: 'list' } };
        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'interactive',
            interactive: parseList,
        };
        return this.sendMessageMeta(body)
    }

    /**
     * Enviar listas alternativo
     * @param {*} number
     * @param {*} header
     * @param {*} text
     * @param {*} footer
     * @param {*} button
     * @param {*} list
     * @returns
     */
    sendList = async (number, header, text, footer, button, list) => {
        const parseList = list.map((list) => ({
            title: list.title,
            rows: list.rows.map((row) => ({
                id: row.id,
                title: row.title,
                description: row.description,
            })),
        }));

        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'interactive',
            interactive: {
                type: 'list',
                header: {
                    type: 'text',
                    text: header,
                },
                body: {
                    text: text,
                },
                footer: {
                    text: footer,
                },
                action: {
                    button: button,
                    sections: parseList,
                },
            },
        };
        return this.sendMessageMeta(body)
    }
    /**
     * Enviar buttons
     * @param {*} number
     * @param {*} text
     * @param {*} buttons
     * @returns
     */
    sendButtons = async (number, text, buttons) => {
        const parseButtons = buttons.map((btn, i) => ({
            type: 'reply',
            reply: {
                id: `btn-${i}`,
                title: btn.body,
            },
        }));

        const body = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: number,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: text,
                },
                action: {
                    buttons: parseButtons,
                },
            },
        };
        return this.sendMessageMeta(body)
    }

    /**
     *
     * @param {*} userId
     * @param {*} message
     * @param {*} param2
     * @returns
     */
    sendMessage = async (number, message, { options }) => {
        if (options?.buttons?.length) return this.sendButtons(number, message, options.buttons)
        if (options?.media) return this.sendMedia(number, message, options.media)

        this.sendtext(number, message);
    }
}

var meta = MetaProvider;

module.exports = meta;
