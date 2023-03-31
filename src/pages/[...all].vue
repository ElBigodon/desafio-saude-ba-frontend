<template>
  <n-button @click="back()">
    Voltar
  </n-button>
</template>

<route lang="yml">
meta:
  layout: 404
</route>

<script setup lang="ts">

const { back } = useRouter()
</script>