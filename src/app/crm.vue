<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const router = useRouter();
const toast = useToast();
const tasks = ref([]);
const newTask = ref('');
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

</script>

<template>
    <div class="page-background">
        <div class="container-md">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card mt-5">
                        <div class="tasks card-header bg-dark text-white">
                            <h3 class="mb-0">Liste des Tâches</h3>
                            <button class="btn btn-success" @click="isOpen = true">+ Ajouter une tâche</button>
                        </div>
                        <div v-if="isOpen" class="form-backdrop">
                            <div class="card fixed-form-container">
                                <div class="card-body">
                                    <form @submit.prevent="addTask" class="mb-3">
                                        <div class="mb-3">
                                            <div class="d-flex justify-content-between align-items-center mb-3">
                                                <h3>Ajouter une tâche</h3>
                                                <button type="button" class="btn-close" aria-label="Close" @click="isOpen = false"></button>
                                            </div>
                                            <label for="taskTitle" class="form-label">Titre de la tâche</label>
                                            <input type="text" v-model="newTask.title" id="taskTitle" class="form-control" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="taskDescription" class="form-label">Description</label>
                                            <textarea v-model="newTask.description" id="taskDescription" class="form-control"></textarea>
                                        </div>
                                        <div class="d-flex justify-content-end gap-2">
                                            <button type="submit" class="btn btn-primary">Ajouter</button>
                                            <button type="button" class="btn btn-danger" @click="isOpen = false">Annuler</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
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
                                        <span>{{ task.title }}</span>
                                        <span class="badge bg-secondary">{{ task.status }}</span>
                                    </div>
                                    <p class="mb-1">{{ task.description }}</p>
                                    <small class="text-muted">Créé le {{ new Date(task.created_at).toLocaleDateString() }}</small>
                                    <button class="btn btn-primary btn-sm mt-2" @click="">Modifier</button>
                                    <button class="btn btn-danger btn-sm mt-2" @click="">Supprimer</button>
                                </li>
                            </ul>
                            <div v-if="tasks.length === 0" class="text-center mt-3">
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
