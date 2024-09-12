kiwi.plugin('userbox-iframe', (kiwi) => {
    kiwi.Vue.component('example-template', {
        props: ['network', 'buffer', 'user', 'sidebarState'],
        template: `
            <div class="kiwi-userbox-basicinfo">
                <div v-if="user.realname.includes('webrtc-video-broadcast-dtc0.onrender.com')">
                    <!-- Botón para mostrar el iframe en el modal -->
                    <button v-if="!showPopup" @click="showPopup = true; publicWebcam()">Ver WebCam Pública</button>
                </div>
                <div v-if="user.realname.includes('CAMPRIVADA')">
                    <button @click="requestWebcam">Solicitar WebCam Privada</button>
                </div>
                <div v-if="showPopup" class="iframe-overlay">
                    <div class="iframe-container" ref="draggable">
                        <iframe :src="iframeUrl" style="width: 100%; height: 100%; border: none;"></iframe>
                        <button @click="closePopup">Cerrar</button>
                    </div>
                </div>
            </div>`,
        data() {
            return {
                showPopup: false,
                iframeUrl: '',
                showIframe: false // Se mantiene en caso de ser necesario para otras funcionalidades
            };
        },
        methods: {
            requestWebcam() {
                if (this.network && this.user) {
                    var nick = this.user.nick;
                    const command = `NOTICE ${nick} PUEDO`;
                    this.network.ircClient.raw(command);
                } else {
                    console.error('No se puede enviar la solicitud de WebCam.');
                }
            },
            publicWebcam() {
                if (this.network && this.user) {
                    var nick = this.user.nick;
                    const command = `NOTICE ${nick} TE MIRO`;
                    this.network.ircClient.raw(command);
                } else {
                    console.error('TE MIRO.');
                }
            },
            requestPrivateWebcam() {
                if (this.network && this.user) {
                    var nick = this.user.nick;
                    const command = `NOTICE ${nick} CAMPRIVADA`;
                    this.network.ircClient.raw(command);
                } else {
                    console.error('No se puede enviar la solicitud de WebCam Privada.');
                }
            },
            handleNotice(message) {
                if (message && message.message.startsWith('SHOWCAMERA ')) {
                    this.iframeUrl = message.message.slice(11); // Obtiene la URL después del comando
                    this.showPopup = true;
                    this.initDrag(); // Inicializa la capacidad de arrastrar
                } else if (message && message.message.startsWith('HIDE')) {
                    this.showPopup = false;               
                }
            },
            closePopup() {
                this.showPopup = false;
            },
            initDrag() {
                const container = this.$refs.draggable;

                let offsetX, offsetY;

                container.addEventListener('mousedown', (e) => {
                    offsetX = e.clientX - container.getBoundingClientRect().left;
                    offsetY = e.clientY - container.getBoundingClientRect().top;

                    const onMouseMove = (e) => {
                        const x = e.clientX - offsetX;
                        const y = e.clientY - offsetY;
                        container.style.transform = `translate(${x}px, ${y}px)`;
                    };

                    const onMouseUp = () => {
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                    };

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });
            }
        },
        mounted() {
            if (this.network) {
                this.network.ircClient.on('notice', (message) => this.handleNotice(message));
            }

            // Añadir CSS al documento
            const style = document.createElement('style');
            style.textContent = `
                .iframe-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .iframe-container {
                    position: absolute;
                    width: 80%;
                    max-width: 300px;
                    height: 80%;
                    max-height: 300px;
                    background-color: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    cursor: move;
                }

                .iframe-container button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .iframe-container button:hover {
                    background: #0056b3;
                }

                .kiwi-nicklist-user[data-nick=nick]:before {
                    content: "";
                    background-image: url(https://chatlatinos.cl/avatar/bots.jpg);
                    display: inline;
                    margin: 3px 5px 3px 0px;
                    background-color: white;
                    background-size: contain;
                    background-repeat: no-repeat;
                    overflow: hidden;
                    float: left;
                    width: 30px;
                    height: 30px;
                }   
            `;
            document.head.appendChild(style);
        }
    });

    kiwi.addUi('userbox_info', 'example-template');
});
