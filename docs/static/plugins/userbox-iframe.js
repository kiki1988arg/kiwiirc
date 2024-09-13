// eslint-disable-next-line no-undef
kiwi.plugin('userbox-iframe', (kiwi) => {

    kiwi.Vue.component('example-template',{
        props: ['network', 'buffer', 'user', 'sidebarState'],
        template: `
        <div class="kiwi-userbox-basicinfo" v-if="this.user.realname.includes('webrtc-video-broadcast-dtc0.onrender.com')">
            <iframe style="height: 230px;" :src="this.user.realname"></iframe>
        </div>`
    })



    // kiwi.addUi('header_channel', loginBtn);
    kiwi.addUi('userbox_info', 'example-template');

});