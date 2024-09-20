
kiwi.plugin('active-cam', function (kiwi, log) {

    // kiwi.addUi('header_channel', button.$mount().$el);

    kiwi.Vue.component('button-counter', {
        template: `            

 <div class="container" style="width:100%;float:left">
         <button @click="toggleCam(true)">Prender cámara</button>
        <button @click="toggleCam(false)">Apagar cámara</button>
        <button @click="showCamera()">Publica</button>
        <button @click="privateCamera()">Privada</button>


    <div class="stream">
        <ul style=" height: 250px;  list-style-type: none;
            overflow: hidden;
        width: max-content;">

            <div v-if="!this.displayCam" style="float:left;width: 300px;
            height: 250px;
            background: black;"></div>

            <li v-if="this.displayCam" style="float: left;margin-right: 20px;" > <iframe id="camera-preview" :src="this.getIframe()" frameborder="0" style=" 
                height: 250px;
                            
                            float: left;" allow="camera; microphone">
                </iframe>
            </li>
       

             <li v-for="(item, index) in getView" style="float: left;" :key="index">
                <i class="fa fa-window-close" style="font-size: 26px;float:right" @click="closeCam(item,index)" aria-hidden="true"></i>

                <iframe :src="'https://irc.chateachat.com:8443/?user=' + item" frameborder="0" style="height: 250px; " allow="camera; microphone">
                </iframe>
            </li>


        </ul>
    </div>
</div>
`,


        data() {
            return {
                isPreviewVisible: false,
                iframeElement: null,
                permissionsGranted: false,
                valor1: '',
                items: kiwi.cams.viewedUsers,
                displayCam: false
            };
        },
        computed: {
            getView() {
                return this.items;
            },

        },
        methods: {
            toggleCam(value) {
                this.displayCam = value;
                (this.displayCam) ? this.showCamera() : this.hideCamera()
            },
            getIframe() {
                return 'https://irc.chateachat.com:8443/broadcast.html?user=' + this.$state.getActiveNetwork().nick;
            },
            requestPermissions() {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then(() => {
                        this.permissionsGranted = true;
                        this.showCamera();
                    })
                    .catch(error => {
                        console.error('Error al solicitar permisos:', error);
                        this.permissionsGranted = false;
                        alert('Permisos de cÃ¡mara no concedidos.');
                    }).then(() => this.showCamera());
            },
            showCamera() {
                this.valor1 = 'https://irc.chateachat.com:8443/?user=' + this.$state.getActiveNetwork().nick;
                // Envia el comando para mostrar la cÃ¡mara
                const network = this.$state.getActiveNetwork();
                if (network && this.valor1) {
                    network.ircClient.raw(`setname ${this.valor1}`);
                }

            },
            privateCamera() {
                const network = this.$state.getActiveNetwork();
                network.ircClient.raw(`setname CAMPRIVADA`);

            },
            hideCamera() {
                const network = this.$state.getActiveNetwork();
                if (network) {
                    network.ircClient.raw('SETNAME ' + this.$state.getActiveNetwork().nick);
                }
            },
            closeCam(nick, index) {
                kiwi.cams.viewedUsers.splice(index, 1);
                this.$state.$emit('cam.close', nick)
            }



        },

        beforeDestroy() {
            this.hideCamera(); // Limpia el iframe si existe
            kiwi.cams.viewedUsers.splice(0, kiwi.cams.viewedUsers.length)
        },
        mounted() {
            console.log(kiwi);
        },
    })



    function loginFn() {
        kiwi.state.$emit('mediaviewer.show', { component: 'button-counter' });
    }

    var loginBtn = document.createElement('a');
    loginBtn.innerHTML = '<i class="fa fa-video-camera" aria-hidden="true"></i>';
    loginBtn.addEventListener("click", loginFn);
    kiwi.addUi('header_channel', loginBtn);

});
