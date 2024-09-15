// Usar window.kiwi.user para pasar arrays de camaras
window.kiwi.cams = {
    viewedUsers : [],
    watchingUsers : [],
    rejectedUsers : []

}

kiwi.plugin('cam-popup', (kiwi) => {

    function openMediaViewer() {
        if(document.querySelector('.stream')==null) 
            kiwi.state.$emit('mediaviewer.show', { component: 'button-counter' });

    }

    
    // Evento cam pública
    kiwi.on('cam.request.public', (user, network, buffer) => {
        if(kiwi.cams.viewedUsers.includes(user.nick))return
        openMediaViewer();
        kiwi.cams.viewedUsers.push(user.nick)
        //Envío al usuario que estoy viendo que lo estoy viendo.
        text = `[CAM][WATCHING]`
        let message = `NOTICE ${user.nick} ${text}`;
        network.ircClient.raw(message);
    })

    kiwi.on('message.new', (event) => {
        let message = event.message;
        let buffer = event.buffer;
        if (!isConference(message)) {
            return;
        }

        //notificación de qué me estan mirando
        if (message.message.startsWith('[NOTICE] [CAM][WATCHING]')) {
            message.template = kiwi.Vue.extend({
                component: 'PopUp'
            })
            kiwi.cams.watchingUsers.push(message.nick)    
        }  
         
    });
    // FIN Evento cam pública


    // Evento cam privada
    kiwi.on('cam.request.private', (user, network, buffer) => {
        if(kiwi.cams.watchingUsers.includes(user.nick))return
        openMediaViewer();
        text = `[CAM][REQUEST] ${user.nick} está solicitando permisos para acceder a tu cam`
        let message = `NOTICE ${user.nick} ${text}`;
        network.ircClient.raw(message);
    })

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
                                kiwi.cams.rejectedUsers.push(message.nick);
                                break;

                            case 'accept':
                                buffer.getNetwork().ircClient.raw('NOTICE', message.nick, '[CAM][OK]');
                                kiwi.cams.watchingUsers.push(message.nick);
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
            kiwi.cams.rejectedUsers.push(message.nick)
        }
        if (message.message.startsWith('[NOTICE] [CAM][OK]')) {
            message.template = kiwi.Vue.extend({
                template: '',
            })
            kiwi.cams.viewedUsers.push(message.nick)
        }

         // Fin Evento cam privada

         // Evento cuando me cierran cam    

        kiwi.on('cam.close', (user,network) => {
            let message = `NOTICE ${user} [CAM][CLOSE]`;
            network.ircClient.raw(message);
            //Envío al usuario que estoy viendo que lo estoy viendo.  
        })  

        kiwi.on('message.new', (event) => {
            let message = event.message;
            let buffer = event.buffer;
            if (!isConference(message)) {
                return;
            }
    
            //notificación de qué me estan mirando
            if (message.message.startsWith('[NOTICE] [CAM][CLOSE]')) {
                message.template = kiwi.Vue.extend({
                    template: '',
                })
                index = kiwi.cams.watchingUsers.indexOf(message.nick)
                kiwi.cams.watchingUsers.splice(index,1)    
            }  
             
        });
        // Fin evento me cierran cam    

        // Evento cuando quiero dejar que alguien me vea

         kiwi.on('cam.close.eye', (user,network) => {
            let message = `NOTICE ${user.nick} [CAM][CLOSEEYE]`;
            network.ircClient.raw(message);
            index = kiwi.cams.watchingUsers.indexOf(message.nick)
            kiwi.cams.watchingUsers.splice(index,1) 
            //Envío al usuario que estoy viendo que lo estoy viendo.  
        })  

        kiwi.on('message.new', (event) => {
            let message = event.message;
            let buffer = event.buffer;
            if (!isConference(message)) {
                return;
            }
    
            //notificación de qué me estan mirando
            if (message.message.startsWith('[NOTICE] [CAM][CLOSEEYE]')) {
                message.template = kiwi.Vue.extend({
                    template: '',
                })
                index = kiwi.cams.viewedUsers.indexOf(message.nick)
                kiwi.cams.viewedUsers.splice(index,1)    
            }  
             
        });
        // Evento cuando quiero dejar que alguien me vea   


    });

    function isConference(message) {
        return message.message.startsWith('[NOTICE] [CAM]')
    };  
});

