<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AddTasks from '../components/app/crm/addTasks.vue';
import ShowDescription from '../components/app/crm/showDescription.vue';
import updateTasks from '@/components/app/crm/updateTasks.vue';
import handleLabels from '@/components/app/crm/labels/handleLabels.vue';

const router = useRouter();
const toast = useToast();
const tasks = ref([]);
const isLoading = ref(false);
const error = ref(null);
const isOpen = ref(false);
const showDescription = ref(false);
const currentTaskDescription = ref('');
const idDescription = ref('')

onMounted(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        router.push('/login');
        toast.error("Vous devez être connecté pour accéder à cette page.");
        return;
    }

    try {
        isLoading.value = true;
        const response = await axios.get("http://127.0.0.1:5000/api/tasks", {
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        });
        tasks.value = await response.data;
    } catch (err) {
        toast.error("Impossible de charger les tâches. Veuillez réessayer plus tard.");
    } finally {
        isLoading.value = false;
    }

})

const handleTaskAdded = (addedTask) => {
    tasks.value.push(addedTask);
};

const openDescriptionModal = (description, idTask) => {
    currentTaskDescription.value = description;
    showDescription.value = !showDescription.value;
    idDescription.value = idTask;
};

const deleteTask = async (id) => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error("Vous devez être authentifié pour effectuer cette action.");
            router.push('/login');
            return;
        }
        await axios.delete(`http://127.0.0.1:5000/api/tasks/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        tasks.value = tasks.value.filter(task => task.id !== id);
        toast.success("Tâche supprimée avec succès !");
    } catch (err) {
        console.error("Erreur lors de la suppression de la tâche :", err);
        toast.error("Impossible de supprimer la tâche. Veuillez réessayer plus tard.");
    }
};

</script>

<template>
    <div class="page-background">
        <div class="container-md">
            <div class="row justify-content-center">
                <div class="col-10 col-md-8">
                    <div class="card mt-5">
                        <div class="tasks card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                            <h1 class="mb-0">Liste des Tâches</h1>
                            <div class="d-flex gap-3">
                                <handleLabels />
                                <button class="btn btn-success" @click="isOpen = true">+ Ajouter une tâche</button>
                            </div>
                        </div>
                        <AddTasks v-model:is-open="isOpen" @task-added="handleTaskAdded" />

                        <div class="card-body">
                            <div v-if="isLoading" class="text-center">
                                <p>Chargement des tâches...</p>
                            </div>
                            <div v-else-if="error" class="alert alert-danger">
                                {{ error }}
                            </div>
                            <ul class="list-group">
                                <li v-for="task in tasks" :key="task.id" class="list-group-item">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="gap-2 d-flex">
                                            <span>{{ task.title }}</span>
                                            <span v-if="task.etat === 'PENDING'" class="badge bg-warning">En cours</span> 
                                            <span v-else-if="task.etat === 'CREATED'" class="badge bg-primary">Créé</span>
                                            <span v-else-if="task.etat === 'COMPLETED'" class="badge bg-success">Complété</span>
                                            <span v-else-if="task.etat === 'ABANDONNED'" class="badge bg-danger">Abandonné</span>
                                        </div>
                                        
                                        <div class="gap-2 d-flex"> 
                                            <button v-if="task.description" class="btn btn-outline-primary btn-sm mt-2" @click="openDescriptionModal( task.description, task.id )"> <font-awesome-icon :icon="faEye" /></button>
                                            <button class="btn btn-outline-warning btn-sm mt-2" @click=""><font-awesome-icon :icon="faPenToSquare" /></button>
                                            <button class="btn btn-outline-danger btn-sm mt-2" @click="deleteTask(task.id)"><font-awesome-icon :icon="faTrash" /></button>
                                        </div>
                                    </div>
                                    <small class="text-muted">Créé le {{ new Date(task.created_at).toLocaleDateString() }}</small>
                                    <div>
                                        <hr v-if="showDescription && task.id === idDescription" class="x-divider my-3">
                                        <ShowDescription v-if="task.id === idDescription" v-model:show-description="showDescription" :description-task="currentTaskDescription" />
                                    </div>
                                </li>
                            </ul>
                            <div v-if="tasks.length === 0 && !isLoading && !error" class="text-center mt-3">
                                <p>Aucune tâche en cours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-background {
    background-image: url('../components/img/backgroundTicket.png');
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
}

.tasks {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
}

.card {
    border: none;
    min-height: 300px;
}

</style>
