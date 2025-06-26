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

watch(isOpen, (newValue) => {
    if (newValue) {
        getLabels();
    }
});

const getLabels = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/labels");
        labels.value = response.data;
    } catch (error) {
        toast.error("Impossible de charger les labels. Veuillez réessayer plus tard.");
    }
};

const addLabel = async (label) => {
    try {
        await axios.post("http://localhost:3000/api/labels", { label });
        toast.success("Label ajouté avec succès !");
        await getLabels();
    } catch (error) {
        toast.error("Erreur lors de l'ajout du label. Veuillez réessayer.");
    }
};

const deleteLabel = async (labelId) => {
    try {
        await axios.delete(`http://localhost:3000/api/labels/${labelId}`);
        toast.success("Label supprimé avec succès !");
        await getLabels();
    } catch (error) {
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
                <button type="button" class="btn-close" aria-label="Close" @click="isOpen = false"></button>
            </div>
            <div class="card-body">
                <div v-if="labels.length > 0"></div>
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