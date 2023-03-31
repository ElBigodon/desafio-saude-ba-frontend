<template>
  <n-data-table
    striped
    :columns="columns"
    :data="data"
    :loading="isLoading"
    :min-height="!isMobile ? '550px' : '200px'"
    :max-height="!isMobile ? '600px' : '200px'"
    :pagination="paginator"
  />
  <!-- ANCHOR - Modal de vizualização de dados -->
  <n-modal> </n-modal>
  <!-- ANCHOR - Modal de editação de dado -->
  <n-modal
    class="!w-[550px] !h-[575px]"
    :loading="Pending"
    v-model:show="showEditModal"
    preset="confirm"
    positive-text="Adicionar"
    @positive-click="handleSubmitEditForm"
    negative-text="Cancelar"
    :show-icon="false"
    :closable="false"
  >
    <n-card>
      <n-form ref="editFormRef" :model="editFormData">
        <n-form-item label="Nome">
          <n-input v-model:value="editFormData.name" />
        </n-form-item>
        <n-form-item label="E-mail">
          <n-input v-model:value="editFormData.email" />
        </n-form-item>
        <n-form-item label="CPF">
          <n-input v-model:value="editFormData.cpf" />
        </n-form-item>
        <n-form-item label="Perfil">
          <n-select v-model:value="editFormData.profile" :options="editProfileOptionsData" />
        </n-form-item>
        <n-form-item label="Endereços">
          <n-dynamic-input
            :min="1"
            :max="5"
            key-placeholder="Logradouro"
            value-placeholder="CEP"
            preset="pair"
            v-model:value="editFormData.addresses"
          />
        </n-form-item>
      </n-form>
    </n-card>
  </n-modal>
  <!-- ANCHOR - Modal de remoção de dado -->
  <n-modal> </n-modal>
</template>

<script setup lang="ts">
import { NButton, NTooltip, type FormInst } from 'naive-ui/es/components'

const emitter = defineEmits(['update:request', 'update:page'])

// eslint-disable-next-line no-undef
const { data, isLoading, isMobile } = $defineProps<{
  isLoading: boolean
  isMobile: boolean
  data: any
}>()

let currentUserUUID = $ref('')

const {
  data: result,
  execute,
  isLoading: Pending,
  cancel,
  error,
  response
} = useAxios(`/users/${currentUserUUID}`, {
  baseURL: 'http://localhost:8000/api'
})

onMounted(cancel)

watch(result, () => console.log(result.value))

// SECTION - Variaveis do formulário de edição de dados

const [showEditModal, toggleShowEditModal] = useToggle()

const editFormRef = ref<null | FormInst>(null)

let editFormData = ref({
  name: '',
  email: '',
  cpf: '',
  profile: 'user',
  addresses: [{ key: '', value: '' }] as { key: string; value: string }[]
})

const editProfileOptionsData = $ref([
  { label: 'Usuário', value: 'user' },
  { label: 'Administrador', value: 'admin' }
])

// !SECTION

const message = useMessage()

const paginator = $ref({
  pageSize: 8
})

const columns: DataTableColumns<{ [key: string]: string }> = [
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
    render({ cpf }) {
      let pattern = '###.###.###-##'

      for (let i = 0; i < cpf.length; i++) {
        pattern = pattern.replace('#', cpf[i])
      }

      return pattern
    }
  },
  {
    title: 'Data de cadastro',
    key: 'created_at',
    width: 120,
    render({ created_at }) {
      return new Date(created_at).toLocaleDateString('pt-BR')
    }
  },
  {
    title: 'Perfil',
    key: 'profile',
    width: 80,
    ellipsis: {
      tooltip: true
    },
    render: ({ profile }) => profile.toUpperCase()
  },
  {
    title: 'Ações',
    key: 'actions',
    render({ id }: any) {
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
                {
                  class: isMobile ? 'mb-2 mr-2' : 'mr-2',
                  type: 'info',
                  onClick: () => {
                    currentUserUUID = id
                    execute(`/users/${currentUserUUID}`, {
                      method: 'GET',
                      transformResponse(v: any) {
                        const { addresses, cpf, email, name, profile } = JSON.parse(v)

                        const _result = {
                          name,
                          email,
                          cpf,
                          profile: profile.name,
                          addresses: addresses.map(({ name, cep }: any) => ({
                            key: name,
                            value: cep.name
                          }))
                        }

                        editFormData.value = _result

                        console.log()

                        return _result
                      }
                    })
                    toggleShowEditModal()
                  }
                },
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
                {
                  type: 'error',
                  onClick: () => {
                    currentUserUUID = id
                    handleDeleteUser()
                  }
                },
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

watch(error, () => console.log(error.value))

function handleSubmitEditForm() {
  execute(`/users/update/${currentUserUUID}`, {
    method: 'PATCH',
    data: {
      ...editFormData.value,
      addresses: editFormData.value.addresses.map(({ key, value }) => ({
        address: key,
        cep: value
      }))
    }
  })

  console.log(response.value)
}

async function handleDeleteUser() {
  const { data, status } = await $axios.delete(`/users/delete/${currentUserUUID}`)

  console.log(data, status)
}
</script>
