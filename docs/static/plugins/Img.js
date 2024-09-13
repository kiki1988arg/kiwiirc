/* global kiwi:true */

kiwi.on('message.new', (event) => {

    let message = event.message;
    let buffer = event.buffer;
    if (!isImg(message.message)) {
        return;
    }
    str = message;
    res = str.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/)[0];

    let inviteState = kiwi.Vue.observable({
        members: [message.nick],
        timeout: Date.now(),
    });

    message.template = kiwi.Vue.extend({
        template: `<p><img svyle="max-height:500px;max-width:500px" src=${res} alt="Girl in a jacket" width="500" height="600"></p>`
      })
    


    
});

function isImg(msg) {
    /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(msg)
}


function img_create(src, alt, title) {
    var img = IEWIN ? new Image() : document.createElement('img');
    img.src = src;
    if ( alt != null ) img.alt = alt;
    if ( title != null ) img.title = title;
    return img;
}

