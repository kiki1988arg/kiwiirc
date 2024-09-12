// Usar window.kiwi.user para pasar arrays de camaras
window.kiwi.viewedUsers = []
window.kiwi.watchingUsers = []
window.kiwi.rejectedUsers = []

kiwi.plugin('cam-popup', (kiwi) => {
    // Evento cam pública
    kiwi.on('request.public', (user, network, buffer) => {

        kiwi.viewedUsers.push(user.nick)


    })

    // Evento cam privada
    kiwi.on('request.private', (user, network, buffer) => {

        console.log(user)

        text = `[CAM][REQUEST] ${user.nick} está solicitando permisos para acceder a tu cam`


        let message = `NOTICE ${user.nick} ${text}`;
        network.ircClient.raw(message);


    })


    // Listen for new conference message and replace with our component
    kiwi.on('message.new', (event) => {
        let message = event.message;
        let buffer = event.buffer;
        if (!isConference(message)) {
            return;
        }

        if (message.message.startsWith('[NOTICE] [CAM][REQUEST]')) {

            message.template = kiwi.Vue.extend({
                template: `
                <p v-if="this.show" style="text-align: center;">El usuario ${message.nick} solicita permisos para observar su cam. <Button
                class="u-button u-button-primary" style="background:red;width: 100px;" @click="action('reject')">Rechazar</Button> <Button class="u-button u-button-primary" style="background:green;width: 100px;"  @click="action('accept')">Aceptar</Button></p>
                        `,
                data: function () {
                    return {
                        show: true
                    }
                },
                methods: {
                    action(state) {
                        this.show = false;

                        switch (state) {
                            case 'reject':
                                buffer.getNetwork().ircClient.raw('NOTICE', message.nick, '[CAM][NO]');
                                kiwi.rejectedUsers.push(message.nick);
                                break;

                            case 'accept':
                                buffer.getNetwork().ircClient.raw('NOTICE', message.nick, '[CAM][OK]');
                                kiwi.watchingUsers.push(message.nick);
                                break;

                        }


                    },
                },



            })
        }
        if (message.message.startsWith('[NOTICE] [CAM][NO]')) {
            message.template = kiwi.Vue.extend({
                template: `
                <p style="text-align: center;">El usuario <span style="color:blue">${message.nick}</span> ha rechazado la petición.</p>
                        `,
            })
        }
        if (message.message.startsWith('[NOTICE] [CAM][OK]')) {
            message.template = kiwi.Vue.extend({
                template: '',
            })
            kiwi.viewedUsers.push(message.nick)

        }




    });

    function isConference(message) {
        return message.message.startsWith('[NOTICE] [CAM]')
    };  
});

