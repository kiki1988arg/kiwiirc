
kiwi.plugin('update-cam', (kiwi) => {
    kiwi.on('message.new', (event) => {
        let message = event.message;
        let buffer = event.buffer;
    });
 
    kiwi.on('irc.join', (event, net) => {
        kiwi.Vue.nextTick(() => {
            updateCam(net, event.nick, false);
        });
    });
 
    kiwi.on('irc.wholist', (event, net) => {
        let nicks = event.users.map((user) => user.nick);
        kiwi.Vue.nextTick(() => {
            nicks.forEach((nick) => {
                updateCam(net, nick, false);
            });
        });
    });
 
    function updateCam(net, nick, _force) {
        let force = !!_force;
        let user = kiwi.state.getUser(net.id, nick);
        if (!user) {
            return;
        }

        if (user.cam) {
            let match = user.username.match(/^(uid|sid)([0-9]+)$/);
            if (match) {
                // is irccloud user
                let avatarUrl = 'https://static.irccloud-cdn.com/avatar-redirect/' + match[2];
                let img = document.createElement('icon');
                img.src = avatarUrl;    
                scrachElement.appendChild(img);
            }
        }
    }
 

});
