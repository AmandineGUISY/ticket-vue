<template>
    <div v-if="props.showDescription" class="">
        <div class="modal-header d-flex justify-content-between align-items-center">
            <p>{{ props.descriptionTask }}</p>
            <button type="button" class="btn-close" aria-label="Close" @click="closeDescription"></button>
        </div>
    </div>
</template>

<script setup> 
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    showDescription: {
        type: Boolean,
        default: false
    }
    ,
    descriptionTask: {
        type: String,
        default: ''
    },
})

const emit = defineEmits(['update:showDescription', 'update:descriptionTask']);

const closeDescription = () => {
    emit('update:showDescription', false);
};

</script>