<template lang="">
<div class="container" style="height: 250px; width:100%;float:left">

<div class="stream" style="
                        float:left
                        display: ruby;
                        height: 100%;
                        display: block ruby;
                        width:100%;">
    <ul style=" height: 250px;  list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
    width: max-content;">
        <li style="float: left;"> <iframe id="camera-preview" :src="this.getIframe()" frameborder="0" style=" 
            height: 250px;
                        
                        float: left;" allow="camera; microphone">
            </iframe></li>
        <li v-for="(item, index) in getView" style="float: left;">
           
            <span style="font-size: 26px;float:right"  aria-hidden="true">HOLAAAAAAAAAAAAAAAAAAAAAAAA</span>

            <iframe :src="item" frameborder="0" style="height: 250px; " allow="camera; microphone">
            </iframe>
        </li>
    </ul>
</div>
</div>
</template>
<script>
export default {

    props() {
        items: users
    },
    data() {
        return {
            isPreviewVisible: false,
            iframeElement: null,
            permissionsGranted: false,
            valor1: ''
        };
    },
    computed: {
        getView() {
            return this.items;
        },


    },
    methods: {
        getIframe() {
            return 'http://localhost:4000/broadcast.html?user=' + this.$state.getActiveNetwork().nick;
        },
        buttonClicked() {
            this.toggleCameraPreview();
        },
        toggleCameraPreview() {
            this.isPreviewVisible = !this.isPreviewVisible;
            if (this.isPreviewVisible) {
                this.requestPermissions();
            }
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
            this.iframeElement = document.getElementById('camera-preview');
            if (this.iframeElement) {
                this.iframeElement.style.display = 'block'; // Muestra el iframe
                this.valor1 = 'https://webrtc-video-broadcast-dtc0.onrender.com/?user=' + this.$state.getActiveNetwork().nick;
                // Envia el comando para mostrar la cÃ¡mara
                const network = this.$state.getActiveNetwork();
                if (network && this.valor1) {
                    network.ircClient.raw(`setname ${this.valor1}`);
                } else {
                    console.error('Red activa o valor1 no disponible.');
                }
            } else {
                console.error('El iframe no se encontrÃ³ en el DOM.');
            }

        },
        hideCamera() {
            const network = this.$state.getActiveNetwork();
            if (network) {
                network.ircClient.raw('SETNAME ' + this.$state.getActiveNetwork().nick);
            }
        }


    }

}

</script>
<style lang="">

</style>