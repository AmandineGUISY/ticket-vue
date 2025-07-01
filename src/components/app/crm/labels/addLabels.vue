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

const emit = defineEmits(['update:isAddingLabels', 'taskToAddLabels']);
const toast = useToast();
const newLabels = ref({labels: []});
const labels = ref([]);

watch(() => props.taskToAddLabels, (task) => {
    if (task) {
        newLabels.value = {
            labels: task.labels,
            id: task.id
        };
        getLabels();
    }
}, { immediate: true });


const closeForm = () => {
    emit('update:isAddingLabels', false);
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

</script>

<template>
    <div v-if="isAddingLabels">
        <div class="card-body">
            <div v-if="labels.length > 0">
                <ul class="list-group">
                    <li v-for="label in labels" :key="label.id" class="list-group-item d-flex justify-content-between align-items-center">
                        <span :class="`badge text-bg-${label.color.toLowerCase()}`">{{ label.title }}</span>
                        <button type="button" class="btn btn-danger btn-sm btn-square-icon">
                            <font-awesome-icon :icon="faClose" />
                        </button>
                    </li>
                </ul>
            </div>
            <div v-else> Aucun Labels n'est disponible</div>
        </div>
    </div>
</template>

<style scoped>

</style>