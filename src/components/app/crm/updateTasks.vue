<script setup>
    import axios from 'axios';
    import { ref, defineProps, defineEmits } from 'vue';
    import { useToast } from 'vue-toastification';

    const props = defineProps({
        isOpen: {
            type: Boolean,
            default: false
        },
        idTask: {
            type: String,
            default: ''
        }
    });

    const emit = defineEmits(['update:isOpen','task-modified']);

    const toast = useToast();
    const newTask = ref({
        title: '',
        description: '',
        created_at: '',
        etat: '',
        id: ''
    });

    const etats= [
        { name: 'Créé', value: 'CREATED' },
        { name: 'En cours', value: 'PENDING' },
        { name: 'Complété', value: 'COMPLETED' },
        { name: 'Abandonné', value: 'ABANDONNED' }    
    ]

    const closeForm = () => {
        emit('update:isOpen', false);
        newTask.value.title = '';
        newTask.value.description = '';
        newTask.value.etat = 'CREATED';
    };

    const addTask = async () => {
        if (newTask.value.title.trim() === '') {
            toast.error('Le titre de la tâche est requis.');
            return;
        }

        const taskData = {
            title: newTask.value.title,
            labels: [],
            description: newTask.value.description.trim(),
            etat: newTask.value.etat
        };

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                toast.error("Vous devez être authentifié pour ajouter une tâche.");
                return;
            }
            const response = await axios.post('http://127.0.0.1:5000/api/tasks/create_task', taskData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }, 
            });
            emit('task-added', response.data);
            toast.success('Tâche ajoutée avec succès !');
            closeForm();
        } catch (err) {
            console.error("Erreur lors de l'ajout de la tâche :", err);
            let errorMessage = "Problème lors de l'ajout d'une tâche";
            if (axios.isAxiosError(err) && err.response) {
                errorMessage = err.response.data?.detail || err.response.data?.message || `Erreur: ${err.response.statusText} (${err.response.status})`;
            }
            toast.error(errorMessage);
        }
    };
</script>

<template>
    <div v-if="props.isOpen" class="form-backdrop">
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
                    <div class="mb-3 d-flex gap-2">
                        <label for="taskLabels" class="form-label">Status</label>
                        <select v-model="newTask.etat" id="taskEtat" required>
                            <option v-for="etat in etats" :key="etat.key" :value="etat.value" class="form-select">{{ etat.name }}</option>
                        </select>
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