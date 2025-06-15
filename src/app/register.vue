<script setup lang="ts">
    import { ref, computed, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { checkPasswordStrength, isValidEmail } from '../utils/formCheck.ts';

    const name = ref('');
    const surname = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const passwordStrength = ref(0);
    const strenghtText = ref('');
    const strenghtColor = ref('bg-danger');
    
    const router = useRouter();

    const updatePasswordStrength = () => {
        const { score, label, colorClass } = checkPasswordStrength(password.value);
        passwordStrength.value = score;
        strenghtText.value = label;
        strenghtColor.value = colorClass;
    };

    watch(password, updatePasswordStrength);

    const isSubmitDisabled = computed(() => {
        return password.value !== confirmPassword.value ||
            passwordStrength.value < 80 ||
            !isValidEmail(email.value) ||
            !email.value || !password.value || !confirmPassword.value || !name.value || !surname.value;
    });

    const handleSubmit = async () => {
        const formData = {
            email: email.value,
            password: password.value,
            nom: name.value,
            prenom: surname.value,
        };
    
        try {
            const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erreur de l'API:", errorData);
                alert(`Erreur d'inscription: ${errorData.detail || response.statusText}`);
                return;
            }
    
            const data = await response.json();
            console.log("Réponse de l'API :", data);
            router.push('/login');

        } catch (err) {
            console.error("Erreur lors de la requête :", err);
            alert("Une erreur est survenue. Veuillez réessayer.");
        }
    }

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
                                    <label for="name" class="form-label">Prénom</label>
                                    <input type="text" class="form-control" id="name" v-model="name" required>
                                </div>
                                <div class="mb-3">
                                    <label for="surname" class="form-label">Nom</label>
                                    <input type="text" class="form-control" id="surname" v-model="surname" required>
                                </div>
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
                                <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitDisabled">S'inscrire</button>
                            </form>
                        </div>
                        <div class="card-footer text-center">
                            <p class="mb-0">Déjà inscrit ? <a href="/login">Se connecter</a></p>
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

a {
    text-decoration: none;
}

</style>
