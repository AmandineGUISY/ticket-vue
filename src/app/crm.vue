<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import AddTasks from '../components/app/crm/addTasks.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEye, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const router = useRouter();
const toast = useToast();
const tasks = ref([]);
const isLoading = ref(false);
const error = ref(null);
const isOpen = ref(false);

onMounted(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        //router.push('/login');
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
        console.error("Erreur lors de la récupération des tâches :", err);
        toast.error("Impossible de charger les tâches. Veuillez réessayer plus tard.");
    } finally {
        isLoading.value = false;
    }

})

const handleTaskAdded = (addedTask) => {
    tasks.value.push(addedTask);
};

</script>

<template>
    <div class="page-background">
        <div class="container-md">
            <div class="row justify-content-center">
                <div class="col-10 col-md-8">
                    <div class="card mt-5">
                        <div class="tasks card-header bg-dark text-white">
                            <h3 class="mb-0">Liste des Tâches</h3>
                            <button class="btn btn-success" @click="isOpen = true">+ Ajouter une tâche</button>
                        </div>
                        <AddTasks v-model:is-open="isOpen" @task-added="handleTaskAdded"></AddTasks>
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
                                            <span v-if="task.status === 'Pending'" class="badge bg-warning">En cours</span>
                                            <span v-else-if="task.status === 'Completed'" class="badge bg-success">Complété</span>
                                        </div>
                                        
                                        <div class="gap-2 d-flex">
                                            <button class="btn btn-outline-primary btn-sm mt-2" @click=""><font-awesome-icon :icon="faEye" /></button>
                                            <button class="btn btn-outline-warning btn-sm mt-2" @click=""><font-awesome-icon :icon="faPenToSquare" /></button>
                                            <button class="btn btn-outline-danger btn-sm mt-2" @click=""><font-awesome-icon :icon="faTrash" /></button>
                                        </div>
                                    </div>
                                    <small class="text-muted">Créé le {{ new Date(task.created_at).toLocaleDateString() }}</small>
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
