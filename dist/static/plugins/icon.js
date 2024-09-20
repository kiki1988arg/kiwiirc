kiwi.plugin('icon', function (kiwi, log) {


    kiwi.on('irc.join', function (event, network) {
        var username = event.ident;
        var nick = event.nick;

        kiwi.state.addUser(network.id, { nick: nick, cam: false });
    });

    kiwi.on('message.new', (event) => {
        let message = event.message;
        let buffer = event.buffer;
    });
});