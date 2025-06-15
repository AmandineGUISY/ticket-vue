<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleSubmit = () => {
  if (password.value !== confirmPassword.value) {
    alert("Les mots de passe ne correspondent pas !");
    return;
  }

  console.log('Inscription:', { email: email.value, password: password.value });
  alert('Inscription réussie (simulation)');
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
