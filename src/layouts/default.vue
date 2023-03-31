<template>
  <n-config-provider :lang="ptBR" :date-locale="datePtBR">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <main class="w-screen h-screen">
              <router-view />
            </main>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ptBR, datePtBR } from 'naive-ui'
</script>
