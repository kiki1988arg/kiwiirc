kiwi.plugin('camera-header', function (kiwi) {

    kiwi.Vue.component('button-counter', {
        data: function () {
            return {
                count: 0
            }
        },
        template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
    })
    var data = new kiwi.Vue({ data: { themeName: '' } });
    data.themeName = kiwi.themes.currentTheme().name.toLowerCase();

    kiwi.on('theme.change', function (event) {
        data.themeName = kiwi.themes.currentTheme().name.toLowerCase();
    });

    function loginFn() {
        kiwi.state.$emit('mediaviewer.show', { component: 'button-counter' });
    }

    var loginBtn = document.createElement('a');
    loginBtn.innerHTML = '<i aria-hidden="true" class="fa fa-sign-in"></i><span>Login</span>';
    loginBtn.addEventListener("click", loginFn);
    kiwi.addUi('header_channel', loginBtn);

});