<template>
  <div class="flex justify-center" v-if="isMobile && !inLandscape">
    <n-alert class="mx-2" type="warning">
      Coloque o Smartphone na horizontal para melhor experiência.
    </n-alert>
  </div>

  <div v-else class="mx-6">
    <n-space justify="space-between" vertical>
      <n-card>
        <n-form ref="formRef" :model="formData">

          <n-space justify="space-between" align="center">

            <n-space justify="start" align="center">

              <n-form-item path="name" label="Nome">
                <n-input v-model:value="formData.name" />
              </n-form-item>
              <n-form-item path="cpf" label="CPF">
                <n-input v-model:value="formData.cpf" />
              </n-form-item>
              <n-form-item path="registeredAt" label="Data de cadastro">
                <n-date-picker clearable :is-date-disabled="disabledFutureDate" v-model:value="formData.registeredAt" type="daterange" />
              </n-form-item>

            </n-space>

            <n-button> Confirmar </n-button>
          </n-space>
        </n-form>
      </n-card>
      <n-data-table
        striped
        :columns="columns"
        :data="data"
        virtual-scroll
        :max-height="!isMobile ? '500px' : '200px'"
      />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { NButton, NTooltip, type FormInst } from 'naive-ui'

const emitter = defineEmits(['update:show'])

const message = useMessage()

onMounted(() => emitter('update:show'))

const { isMobile, inLandscape } = useDevice()

const formRef = ref<FormInst | null>(null)

const formData = reactive({
  name: '',
  cpf: '',
  registeredAt: null as [number, number] | null
})

const disabledFutureDate = (ts: number) => ts > Date.now()

watch(formData, () => console.log(formData.registeredAt))

const columns: DataTableColumns = [
  {
    title: 'ID',
    key: 'id',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Nome',
    key: 'name',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'E-mail',
    key: 'email',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'CPF',
    key: 'cpf',
    ellipsis: {
      tooltip: true
    },
    render({ cpf }: { cpf: string }) {
      let pattern = '###.###.###-##'

      for (let i = 0; i < cpf.length; i++) {
        pattern = pattern.replace('#', cpf[i])
      }

      return pattern
    }
  },
  {
    title: 'Data de cadastro',
    key: 'registeredAt',
    render({ registeredAt }) {
      return new Date(registeredAt as string).toLocaleString('pt-BR')
    }
  },
  {
    title: 'Perfil',
    key: 'profile',
    width: 80,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Ações',
    key: 'actions',
    render() {
      return [
        h(
          NTooltip,
          {
            'keep-alive-on-hover': false
          },
          {
            default: () => 'Visualizar usuário',
            trigger: () =>
              h(
                NButton,
                {
                  class: isMobile ? 'mb-2 mr-2' : 'mr-2',
                  type: 'primary',
                  onClick: () => message.info('Você clicou no botão')
                },
                {
                  icon: () => h('i', { class: 'i-ic:baseline-remove-red-eye' })
                }
              )
          }
        ),
        h(
          NTooltip,
          {
            'keep-alive-on-hover': false
          },
          {
            default: () => 'Editar usuário',
            trigger: () =>
              h(
                NButton,
                { class: isMobile ? 'mb-2 mr-2' : 'mr-2', type: 'info' },
                {
                  icon: () => h('i', { class: 'i-mdi:lead-pencil' })
                }
              )
          }
        ),
        h(
          NTooltip,
          {
            'keep-alive-on-hover': false
          },
          {
            default: () => 'Remover usuário',
            trigger: () =>
              h(
                NButton,
                { type: 'error' },
                {
                  icon: () => h('i', { class: 'i-ic:baseline-delete' })
                }
              )
          }
        )
      ]
    }
  }
]

const data = $ref(
  Array.from({ length: 1000 }, (_, i) => {
    const genRandomString = () => Math.random().toString(36).substring(2)

    const randomYear = Math.floor(Math.random() * (2020 - 1990 + 1)) + 1990
    const randomMonth = Math.floor(Math.random() * (12 - 1 + 1)) + 1
    const randomDay = Math.floor(Math.random() * (31 - 1 + 1)) + 1

    const randomHour = Math.floor(Math.random() * (24 - 1 + 1)) + 1
    const randomMinute = Math.floor(Math.random() * (59 - 1 + 1)) + 1
    const randomSecond = Math.floor(Math.random() * (59 - 1 + 1)) + 1

    const randomCPF = Math.floor(Math.random() * (10000000000 - 99999999999 + 1)) + 99999999999

    return {
      id: i,
      registeredAt: new Date(
        randomYear,
        randomMonth,
        randomDay,
        randomHour,
        randomMinute,
        randomSecond
      ).toISOString(),
      cpf: String(randomCPF),
      name: `${genRandomString()} ${genRandomString()}`,
      email: `${genRandomString()}@${genRandomString()}.${genRandomString().slice(0, 3)}`,
      profile: Math.round(Math.random()) ? 'admin' : 'user'
    }
  })
)
</script>
