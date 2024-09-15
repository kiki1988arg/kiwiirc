<template>
    <div>

        <div ref="draggableContainer" id="draggable-container" v-bind:style="{ top: 50 + index * 3.25 + '%' }">
            <i class="fa fa-window-close" style="font-size: 22px;float:right;transform: translateY(22px);" @click="closeCam(index)"
                        aria-hidden="true"></i>
            <div id="draggable-header" @mousedown.prevent="dragMouseDown" @touchstart.prevent="touchDown">
                <div class="header">{{ src }}
                    

                </div>
            </div>
            <div style="background-color: aliceblue;">


                <iframe :src="'https://irc.chateachat.com:3000/?user=' + src" frameborder="0" style="height: 250px;"
                    allow="camera; microphone">
                </iframe>
            </div>

        </div>
    </div>
</template>


<script>
export default {
    props: ['src', 'index'],
    data: function () {
        return {
            positions: {
                clientX: undefined,
                clientY: undefined,
                movementX: 0,
                movementY: 0,

            },


        }
    },
    methods: {
        dragMouseDown: function (event) {
            event.preventDefault()
            // get the mouse cursor position at startup:
            this.positions.clientX = event.clientX
            this.positions.clientY = event.clientY
            document.onmousemove = this.elementDrag
            document.onmouseup = this.closeDragElement
        },
        touchDown: function (event) {
            event.preventDefault()
            // get the mouse cursor position at startup:
            this.positions.clientX = event.clientX
            this.positions.clientY = event.clientY
            document.ontouchmove = this.touchStart
            document.ontouchend = this.closeDragElement
        },
        elementDrag: function (event) {
            event.preventDefault()
            this.positions.movementX = this.positions.clientX - event.clientX
            this.positions.movementY = this.positions.clientY - event.clientY
            this.positions.clientX = event.clientX
            this.positions.clientY = event.clientY
            // set the element's new position:
            this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
            this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
        }, touchStart: function (event) {
            event.preventDefault()
            // grab the location of touch
            this.positions.movementX = this.positions.clientX - event.targetTouches[0].pageX
            this.positions.movementY = this.positions.clientY - event.targetTouches[0].pageY
            this.positions.clientX = event.targetTouches[0].pageX
            this.positions.clientY = event.targetTouches[0].pageY

            // assign box new coordinates based on the touch.
            this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
            this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'

        },


        closeDragElement() {
            document.onmouseup = null
            document.onmousemove = null
            document.ontouchmove = null
            document.ontouchend = null
        },
        closeCam(value) {
            kiwi.cams.viewedUsers.splice(value, 1);
            this.$state.$emit('cam.close',this.src,this.$state.getActiveNetwork())
        }

    }
}
</script>

<style>
#draggable-container {
    position: absolute;
    z-index: 9;

    left: 50%;
    /* bring your own prefixes */
    transform: translate(-50%, -50%);
}

#draggable-header {
    z-index: 10;
    left: 200px;
    top: 200px;
}

.header {
    background: #97f97c9c;
    margin: 11px 0;
    bottom: -20px;
    transform: translateY(11px);
    cursor: grab;
    width: 275px;
}
</style>