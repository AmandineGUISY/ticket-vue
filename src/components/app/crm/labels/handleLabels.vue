<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';

const toast = useToast();
const labels = ref([]);
const isOpen = ref(false);
const isCreatingLabel = ref(false);

const emit = defineEmits(['label-added']);

const newLabel = ref({
    title: '',
    color: '',
});

const colors = [
    { name: 'Bleu', value: 'Primary' },
    { name: 'Rouge', value: 'Danger' },
    { name: 'Vert', value: 'Success' },
    { name: 'Jaune', value: 'Warning' },
    { name: 'Cyan', value: 'Info' },
    { name: 'Clair', value: 'Light' },
    { name: 'Gris', value: 'Secondary' },
    { name: 'Sombre', value: 'Dark' }
];

watch(isOpen, (newValue) => {
    if (newValue) {
        getLabels();
    }
});

const closeForm = () => {
    isOpen.value = false;
    emit('label-added');
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

const addLabel = async () => {
    if (!newLabel.value.title.trim()) {
        toast.error("Le titre du label est requis.");
        return;
    }
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error("Vous devez être authentifié.");
            return;
        }
        const payload = {
            title: newLabel.value.title,
            color: newLabel.value.color.toLowerCase(),
        };
        await axios.post("http://127.0.0.1:5000/api/labels", payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        toast.success("Label ajouté avec succès !");
        newLabel.value.title = '';
        newLabel.value.color = 'Primary';
        newLabel.value.id = '';
        isCreatingLabel.value = false;
        await getLabels();
    } catch (error) {
        console.error("Erreur lors de l'ajout du label :", error);
        toast.error("Erreur lors de l'ajout du label. Veuillez réessayer.");
    }
};

const deleteLabel = async (labelId) => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            toast.error("Vous devez être authentifié.");
            return;
        }
        await axios.delete(`http://127.0.0.1:5000/api/labels/${labelId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success("Label supprimé avec succès !");
        await getLabels();
    } catch (error) {
        console.error("Erreur lors de la suppression du label :", error);
        toast.error("Erreur lors de la suppression du label. Veuillez réessayer.");
    }
};

</script>

<template>
<div>
    <button class="btn btn-primary" @click="isOpen = !isOpen">Liste des labels</button>
    <div v-if="isOpen" class="form-labels">
        <div class="card fixed-labels-container">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-1">
                    <h3 class="mb-0">Liste des Labels</h3>
                    <button v-if="!isCreatingLabel" type="button" class="btn btn-success btn-sm ms-2 btn-square-icon" @click="isCreatingLabel = !isCreatingLabel">
                        <font-awesome-icon :icon="faPlus" />
                    </button>
                    <button v-else type="button" class="btn btn-danger btn-sm ms-2 btn-square-icon" @click="isCreatingLabel = !isCreatingLabel">
                        <font-awesome-icon :icon="faClose" />
                    </button>
                </div>
                <button type="button" class="btn-close" aria-label="Close" @click="closeForm()"></button>
            </div>
            <div v-if="isCreatingLabel" class="card-header d-flex justify-content-between align-items-center">
                <form @submit.prevent="addLabel">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Nom du label" v-model="newLabel.title">
                        <select v-model="newLabel.color" class="form-select" style="max-width: 120px;">
                            <option v-for="color in colors" :key="color.value" :value="color.value">{{ color.name }}</option>
                        </select>
                        <button type="submit" class="btn btn-success">
                            <font-awesome-icon :icon="faPlus" />
                        </button>
                    </div>
                    
                </form>
            </div>
            <div class="card-body">
                <div v-if="labels.length > 0">
                    <ul class="list-group">
                        <li v-for="label in labels" :key="label.id" class="list-group-item d-flex justify-content-between align-items-center">
                            <span :class="`badge text-bg-${label.color.toLowerCase()}`">{{ label.title }}</span>
                            <button type="button" class="btn btn-danger btn-sm btn-square-icon" @click="deleteLabel(label.id)">
                                <font-awesome-icon :icon="faClose" />
                            </button>
                        </li>
                    </ul>
                </div>
                <div v-else> Aucun Labels n'est disponible</div>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
.form-labels {
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
.fixed-labels-container {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    max-width: 500px;
    width: 90%;
    min-height: unset;
}
.btn-square-icon {
    width: 32px;
    height: 32px;
}
</style>