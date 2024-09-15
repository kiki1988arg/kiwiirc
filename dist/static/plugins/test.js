



kiwi.plugin('userbox-iframe', (kiwi) => {
    kiwi.on('message.new', (event) => {
        kiwi.state.$emit('mediaviewer.show', { component: 'popup' });


    });
});

