<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { isValidEmail } from '../utils/formCheck.ts';

    const email = ref('');
    const password = ref('');

    const router = useRouter();

    const isSubmitDisabled = computed(() => {
        return !isValidEmail(email.value) || !email.value || !password.value;
    });
 
    const handleSubmit = async () => {

        const formDataAsUrlEncoded = new URLSearchParams();
        formDataAsUrlEncoded.append('username', email.value);
        formDataAsUrlEncoded.append('password', password.value);

        try {
            const response = await fetch("http://127.0.0.1:5000/api/auth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formDataAsUrlEncoded,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erreur de l'API:", errorData);
                alert(`Erreur de login: ${errorData.detail || response.statusText}`);
                return;
            }
    
            const data = await response.json();
            console.log("Réponse de l'API :", data);
            router.push('/crm');
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
                                <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitDisabled">S'inscrire</button>
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
