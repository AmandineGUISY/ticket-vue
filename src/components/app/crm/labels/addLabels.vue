<script setup>
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
    isAddingLabels: {
        type: Boolean,
        default: false
    },
    taskToAddLabels: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['update:isAddingLabels', 'task-updated']);
const toast = useToast();
const currentLabels = ref([]);
const labels = ref([]);
const taskId = ref();

watch(() => props.taskToAddLabels, (task) => {
    if (task) {
        currentLabels.value = task.labels;
        taskId.value = task.id;
        getLabels();
    }
}, { immediate: true });


const closeForm = () => {
    emit('update:isAddingLabels', false);
    emit('task-updated');
};

const getLabels = async () => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error("Vous devez être authentifié.");
            return;
        }
        const response = await axios.get("http://127.0.0.1:5000/api/labels", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        labels.value = response.data;
    } catch (error) {
        console.error("Erreur lors du chargement des labels :", error);
        toast.error("Impossible de charger les labels. Veuillez réessayer plus tard.");
    }
};

const addLabelsToTask = async (label) => {
    try  {
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error("Vous devez être authentifié.");
            return;
        }
        await axios.post(`http://127.0.0.1:5000/api/tasks/${taskId.value}/add_label?label_id=${label.id}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        currentLabels.value.push(label);
    } catch(error) {
        console.error("Erreur lors de l'ajout du label :", error);
        toast.error("Impossible d'ajouter des labels, veuillez réessayer plus tard.")
    }
}

const removeLabelsToTask = async (label) => {
    try  {
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error("Vous devez être authentifié.");
            return;
        }
        await axios.patch(`http://127.0.0.1:5000/api/tasks/${taskId.value}/remove-label/${label.id}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        currentLabels.value = currentLabels.value.filter(l => l.id !== label.id);
    } catch(error) {
        console.error("Erreur lors de la suppression du label :", error);
        toast.error("Impossible de supprimer des labels, veuillez réessayer plus tard.")
    }
}
</script>

<template>
    <div v-if="isAddingLabels" class="form-backdrop">
        <div class="card fixed-form-container">
            <div class="card-header d-flex justify-content-between align-items-center mb-3">
                <h3>Ajouter des Labels</h3>
                <button type="button" class="btn-close" aria-label="Close" @click="closeForm()"></button>
            </div>
            <div class="card-body">
                <div v-if="labels.length > 0">
                    <ul class="list-group">
                        <li v-for="label in labels" :key="label.id" class="list-group-item d-flex justify-content-between align-items-center">
                            <span :class="`badge text-bg-${label.color.toLowerCase()}`">{{ label.title }}</span>
                            <button v-if="currentLabels.some(current => current.id === label.id)" type="button" @click="removeLabelsToTask(label)" class="btn btn-danger btn-sm btn-square-icon">
                                <font-awesome-icon :icon="faClose" />
                            </button>
                            <button v-else type="button" @click="addLabelsToTask(label)" class="btn btn-success btn-sm btn-square-icon">
                                <font-awesome-icon :icon="faPlus" />
                            </button>
                        </li>
                    </ul>
                </div>
                <div v-else> Aucun Labels n'est disponible</div>
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