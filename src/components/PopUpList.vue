
<template lang="">
    <div>

        

        <PopUp v-for="(item, index) in items" :key="index" v-bind:src="item" v-bind:index="index"></PopUp>
        
    </div>
</template>
<script>
import PopUp from '@/components/PopUp';
let Vue = require('vue');

export default Vue.component('popup', {
    components: {      
        PopUp,
    },
    data: function () {
        return {
           items: kiwi.cams.viewedUsers
            
        }
    },
    methods: {

    }
    
   
    
})
</script>
<style lang="">
    
</style>