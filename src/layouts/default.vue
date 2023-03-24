<template>
  <n-config-provider :lang="ptBR" :date-locale="datePtBR">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <main class="w-screen h-screen">
              <n-layout class="w-full h-full" has-sider>
                <n-layout-sider
                  collapse-mode="transform"
                  :collapsed-width="0"
                  :width="240"
                  :show-collapsed-content="false"
                  show-trigger="bar"
                  bordered
                  position="absolute"
                  default-collapsed
                >
                  <n-space class="h-full" vertical justify="space-between">
                    <n-card class="h-[80px] uppercase flex justify-center items-center !border-x-0">
                      <h2>fesf-sus</h2>
                    </n-card>
                    <n-card class="h-full !border-y-0"> center </n-card>
                    <n-card class="!w-full h-[80px] items-center">
                      <n-button class="!w-full !flex" type="error" secondary quaternary>
                        <template #icon>
                          <i class="!w-[24px] !h-[24px] i-mdi-exit-run" />
                        </template>

                        Sair

                      </n-button>
                    </n-card>
                  </n-space>
                </n-layout-sider>

                <n-space vertical>
                  <n-layout-header>
                    <n-card class="h-[80px]">
                      Header
                    </n-card>
                  </n-layout-header>

                  <n-layout-content inverted class="w-full h-full">
                    <n-card>
                      <router-view />
                    </n-card>
                  </n-layout-content>
                </n-space>
              </n-layout>
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
