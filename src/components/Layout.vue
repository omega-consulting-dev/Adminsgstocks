<script setup>
import Siderbar from './Sliderbar.vue'
import Navbar from './Navbar.vue'
// props reçues depuis la page
const props = defineProps({
  titre: { type: String, required: true },
  description: { type: String, default: "" }
})
</script>

<template>
  <section class="flex inset-0 bg-gray-100 h-screen overflow-hidden">

    <!-- SIDEBAR -->
    <Siderbar  />

    <!-- MAIN SECTION -->
    <section class="flex-1 flex flex-col overflow-y-auto">

      <!-- NAVBAR -->
       <Navbar 
        :titre="props.titre"
        :description="props.description"
      />

    

      <!-- CONTENU DE LA PAGE (injecté) -->
      <main class="p-4 md:p-6 lg:p-8">
        <slot></slot>
      </main>

    </section>
      </section>
</template>
