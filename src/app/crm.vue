<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const router = useRouter();
const tasks = ref([]);
const newTask = ref('');
const isLoading = ref(false);
const error = ref(null);

onMounted(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        router.push('/login');
        useToast().error("Vous devez être connecté pour accéder à cette page.");
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
        useToast().error("Impossible de charger les tâches. Veuillez réessayer plus tard.");
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
                            <button class="btn btn-success" @click="">+ Ajouter une tâche</button>
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
</style>
