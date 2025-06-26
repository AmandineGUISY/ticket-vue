<template>
<div v-if="props.isOpen" class="form-backdrop AddTasks">
    <div class="card fixed-form-container">
        <div class="card-body">
            <form @submit.prevent="addTask" class="mb-3">
                <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3>Ajouter une tâche</h3>
                        <button type="button" class="btn-close" aria-label="Close" @click="closeForm"></button>
                    </div>
                    <label for="taskTitle" class="form-label">Titre de la tâche</label>
                    <input type="text" v-model="newTask.title" id="taskTitle" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="taskDescription" class="form-label">Description</label>
                    <textarea v-model="newTask.description" id="taskDescription" class="form-control"></textarea>
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

.
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

const emit = defineEmits(['update:isOpen', 'task-added']);

const toast = useToast();
const newTask = ref({
    title: '',
    description: '',
    created_at: '',
    status: 'Pending',
    id: ''
});

const closeForm = () => {
    emit('update:isOpen', false);
    newTask.value.title = '';
    newTask.value.description = '';
    newTask.value.created_at = '';
};

const addTask = async () => {
    if (newTask.value.title.trim() === '') {
        toast.error('Le titre de la tâche est requis.');
        return;
    }

    newTask.value.description = newTask.value.description.trim() || '';
    newTask.value.created_at = new Date().toISOString();
    newTask.value.id = crypto.randomUUID();

    const taskData = {
        title: newTask.value.title,
        labels: [],
        description: newTask.value.description,
    };

    // try {
    //     reponse = await axios.post('/api/tasks/create_task', taskData, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }, 
    //     });
    //     emit('task-added', { ...newTask.value });
    //     toast.success('Tâche ajoutée avec succès !');
    //     closeForm();
    // } catch (error) {
    //     toast.error('Erreur lors de l\'ajout de la tâche. Veuillez réessayer.');
    //     return;
    // }

    emit('task-added', { ...newTask.value });
    toast.success('Tâche ajoutée avec succès !');
    closeForm();
};
</script>

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