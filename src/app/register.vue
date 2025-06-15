<script setup lang="ts">
    import { ref, computed, watch } from 'vue';

    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const passwordStrength = ref(0);
    const strenghtText = ref('');
    const strenghtColor = ref('bg-danger');

    const checkPasswordStrength = () => {
        let strength = 0;
        const value = password.value;

        if (value.length >= 8) strength++;
        if (value.match(/[a-z]/)) strength++;
        if (value.match(/[A-Z]/)) strength++;
        if (value.match(/[0-9]/)) strength++;
        if (value.match(/[^a-zA-Z0-9]/)) strength++;

        passwordStrength.value = (strength/5) * 100;

        if (passwordStrength.value > 80) {
            strenghtText.value = 'Parfait';
            strenghtColor.value = 'bg-success';
        } else if (passwordStrength.value >= 80) {
            strenghtText.value = 'Fort';
            strenghtColor.value = 'bg-success';
        } else if (passwordStrength.value >= 40) {
            strenghtText.value = 'Moyen';
            strenghtColor.value = 'bg-warning';
        } else {
            strenghtText.value = 'Faible';
            strenghtColor.value = 'bg-danger';
        }
    }

    watch(password, checkPasswordStrength);

    const handleSubmit = () => {
        if (password.value !== confirmPassword.value) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }
    };

</script>

<template>
    <div class="page-background">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-dark text-white">
                            <h3 class="mb-0">Créer un compte</h3>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="handleSubmit">
                                <div class="mb-3">
                                    <label for="email" class="form-label">Adresse Email</label>
                                    <input type="email" class="form-control" id="email" v-model="email" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Mot de passe</label>
                                    <input type="password" class="form-control" id="password" v-model="password" required>
                                </div>
                                <div class="mb-3">
                                    <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
                                    <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
                                </div>
                                <div class="progress mb-3" style="height: 10px;">
                                    <div class="progress-bar" role="progressbar" :style="{ width: passwordStrength + '%' }" :class="strenghtColor" :aria-valuenow="passwordStrength" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <small v-if="password.length > 0" class="form-text" :class="strenghtColor.replace('bg-', 'text-')">{{strenghtText}}</small>
                                <div class="mb-3 mt-2">
                                    <small class="form-text text-muted"></small>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">S'inscrire</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.page-background {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url('../components/img/background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
}

.card {
    border: none;
    box-shadow: 6px 4px 6px #2A60AB;
}

</style>
