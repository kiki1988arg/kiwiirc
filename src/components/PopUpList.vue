
<template lang="">
    <div>

        <PopUp v-for="(item, index) in items" :key="index" v-bind:src="item" v-bind:index="index"></PopUp>
        
    </div>
</template>
<script>
import PopUp from '@/components/PopUp';

export default {
    components: {      
        PopUp,
    },
    data: function () {
        return {
           items: kiwi.viewedUsers
            
        }
    },
    
   
    
}
</script>
<style lang="">
    
</style>