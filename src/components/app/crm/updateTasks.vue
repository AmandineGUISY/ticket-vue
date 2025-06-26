<script setup>
import axios from 'axios';
import { ref, defineProps, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:isOpen', 'task-updated']);

const toast = useToast();
const newUpdatedTask = ref({
    title: '',
    description: '',
    created_at: '',
    status: 'Pending',
    id: ''
});

const closeForm = () => {
    emit('update:isOpen', false);
    newUpdatedTask.value.title = '';
    newUpdatedTask.value.description = '';
    newUpdatedTask.value.created_at = '';
};

const updateTask = async () => {
    if (newUpdatedTask.value.title.trim() === '') {
        toast.error('Le titre de la tâche est requis.');
        return;
    }

    newUpdatedTask.value.description = newUpdatedTask.value.description.trim() || '';
    newUpdatedTask.value.created_at = new Date().toISOString();
    newUpdatedTask.value.id = crypto.randomUUID();

    const taskData = {
        title: newUpdatedTask.value.title,
        description: newUpdatedTask.value.description,
    };

    emit('task-added', { ...newUpdatedTask.value });
    toast.success('Tâche modifiée avec succès !');
    closeForm();
};
</script>

<template>
<div v-if="props.isOpen" class="form-backdrop AddTasks">
    <div class="card fixed-form-container">
        <div class="card-body">
            <form @submit.prevent="updateTask" class="mb-3">
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3>Modifier une tâche</h3>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeForm"></button>
                    </div>
                    <label for="taskTitle" class="form-label">Titre de la tâche</label>
                    <input type="text" v-model="updateTask.title" id="taskTitle" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="taskDescription" class="form-label">Description</label>
                    <textarea v-model="updateTask.description" id="taskDescription" class="form-control"></textarea>
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <button type="submit" class="btn btn-primary">Ajouter</button>
                    <button type="button" class="btn btn-danger" @click="closeForm">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<style scoped>
.form-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}
.fixed-form-container {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    max-width: 500px;
    width: 90%;
    min-height: unset;
}
</style>