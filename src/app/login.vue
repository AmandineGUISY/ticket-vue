<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { isValidEmail } from '../utils/formCheck.ts';
    import { useToast } from 'vue-toastification';
    import axios from 'axios';

    const email = ref('');
    const password = ref('');

    const toast = useToast();
    const router = useRouter();

    const isSubmitDisabled = computed(() => {
        return !isValidEmail(email.value) || !email.value || !password.value;
    });
 
    const handleSubmit = async () => {

        const formDataAsUrlEncoded = new URLSearchParams();
        formDataAsUrlEncoded.append('username', email.value);
        formDataAsUrlEncoded.append('password', password.value);

        try {
            const response = await axios.post("http://127.0.0.1:5000/api/auth/token", formDataAsUrlEncoded, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
            ); 

            if (response.data && response.data.access_token) {

                localStorage.setItem('access_token', response.data.access_token);
                
                console.log(response.data);
                toast.success("Connexion réussie !");
                router.push('/crm');

            } else {

                const errorMessage = response.data.message || "Identifiants invalides. Veuillez réessayer.";
                toast.error(errorMessage);
            }
        } catch (err) {

            let errorMessage = "Une erreur inattendue est survenue.";

            if (axios.isAxiosError(err)) {
                if (err.response) {
                    errorMessage = err.response.data?.detail || err.response.data?.message || `Erreur du serveur: ${err.response.status}`;
                    if (err.response.status === 401) {
                        errorMessage = "Identifiants incorrects. Veuillez vérifier votre email et mot de passe.";
                    }
                } else if (err.request) {
                    errorMessage = "Pas de réponse du serveur. Vérifiez votre connexion internet ou l'adresse du serveur.";
                } else {
                    errorMessage = err.message;
                }
            }
            toast.error(errorMessage);
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
                            <h3 class="mb-0">Se connecter</h3>
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
                                <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitDisabled">Se connecter</button>
                            </form>
                        </div>
                        <div class="card-footer text-center">
                            <p class="mb-0">Pas encore inscrit ? <a href="/register">Créer un compte</a></p>
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
