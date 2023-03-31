<template>
  <div class="flex justify-center" v-if="isMobile && !inLandscape">
    <n-alert class="mx-2" type="warning">
      Coloque o Smartphone na horizontal para melhor experiência.
    </n-alert>
  </div>

  <div v-else class="mx-4">
    <n-space justify="space-between" vertical>
      <!-- ANCHOR - Card de filtragem de usuários -->
      <n-card>
        <n-space justify="space-around" align="center">
          <n-card>
            <n-form ref="searchFormRef" :model="searchFormData">
              <n-space justify="space-between" align="center">
                <n-space justify="start" align="center">
                  <n-form-item path="name" label="Nome">
                    <n-input
                      :allow-input="allowNameInput"
                      placeholder="João"
                      v-model:value="searchFormData.name"
                      clearable
                    />
                  </n-form-item>

                  <n-form-item path="cpf" label="CPF">
                    <n-input
                      :maxlength="11"
                      placeholder="401.731.575-56"
                      v-model:value="searchFormData.cpf"
                      :allow-input="allowCpfInput"
                      clearable
                    />
                  </n-form-item>

                  <n-form-item path="registeredAt" label="Data de cadastro">
                    <n-date-picker
                      clearable
                      :is-date-disabled="disabledFutureDate"
                      v-model:value="searchFormData.created_at"
                      type="daterange"
                      start-placeholder="De"
                      end-placeholder="Até"
                    />
                  </n-form-item>
                </n-space>
              </n-space>
            </n-form>
          </n-card>

          <!-- ANCHOR - Card de adição de usuários -->
          <n-card>
            <n-tooltip>
              <template #trigger>
                <n-button @click="toggleShowAddModal()" type="primary">
                  <template #icon>
                    <i class="i-material-symbols:add" />
                  </template>
                </n-button>
              </template>
              Adicionar um novo usuário
            </n-tooltip>
          </n-card>
        </n-space>
      </n-card>

      <!-- ANCHOR - Tabela de dados -->
      <users-table
        @update:request="execute()"
        @update:page="handleSearchPage"
        :data="filteredData"
        :isMobile="isMobile"
        :isLoading="isLoading"
      />
    </n-space>
  </div>

  <!-- ANCHOR - Modal de adição de usuário -->
  <n-modal
    class="!w-[550px] !h-[575px]"
    :loading="isLoadingAddForm"
    v-model:show="showAddModal"
    preset="confirm"
    positive-text="Adicionar"
    @positive-click="handleSubmitAddForm"
    negative-text="Cancelar"
    :show-icon="false"
    :closable="false"
  >
    <n-scrollbar class="max-h-[485px]">
      <n-card title="Adicionar usuário">
        <n-form ref="addFormRef" :rules="addFormRule" :model="addFormData">
          <n-form-item required label="Nome" path="name">
            <n-input placeholder="Nome" v-model:value="addFormData.name" />
          </n-form-item>
          <n-form-item required label="E-mail" path="email">
            <n-input placeholder="E-mail" v-model:value="addFormData.email" />
          </n-form-item>
          <n-form-item required label="CPF" path="cpf">
            <n-input placeholder="CPF" v-model:value="addFormData.cpf" />
          </n-form-item>
          <n-form-item label="Perfil" path="profile">
            <n-select :options="addProfileOptionsData" v-model:value="addFormData.profile" />
          </n-form-item>
          <n-form-item required :label="`Endereços (${addFormAddressesSize}/5)`" path="addresses">
            <n-dynamic-input
              :min="1"
              :max="5"
              key-placeholder="Logradouro"
              value-placeholder="CEP"
              preset="pair"
              v-model:value="addFormData.addresses"
            />
          </n-form-item>
        </n-form>
      </n-card>
    </n-scrollbar>
  </n-modal>

</template>

<script setup lang="ts">
import { NButton, NTooltip, type FormInst, type FormRules } from 'naive-ui'

// ANCHOR - Variaveis

const { isMobile, inLandscape } = useDevice()

const searchFormRef = ref<FormInst | null>(null)

const searchFormData = reactive({
  name: '',
  cpf: '',
  created_at: null as [number, number] | null
})
const message = useMessage()

// SECTION - Variaveis do formulário de adição de dados

const addFormRef = ref<FormInst | null>(null)

const [isLoadingAddForm, toggleIsLoadingAddForm] = useToggle()

const [showAddModal, toggleShowAddModal] = useToggle()

let addFormData = reactive({
  name: '',
  email: '',
  cpf: '',
  profile: 'user',
  addresses: [{ key: '', value: '' }] as { key: string; value: string }[]
})

const addFormRule: FormRules = {
  name: {
    required: true,
    message: 'Nome obrigatório'
  },
  cpf: {
    required: true,
    transform: (v) => v.replace(/[\s\W]+/g, ''),
    validator(ctx, v) {
      if (!v) {
        ctx.message = 'CPF obrigatório'

        return false
      }

      if (!Number(v)) {
        ctx.message = 'CPF deve ser um número'

        return false
      }

      if (v.length !== 11) {
        ctx.message = 'CPF inválido'

        return false
      }

      return true
    }
  },
  email: {
    required: true,
    message: 'Email obrigatório',
    transform: (v) => v.replace(/\s/g, ''),
    validator(ctx, v) {
      if (!v.replace(/\s/g, '')) {
        ctx.message = 'Email obrigatório'

        return false
      }

      // Regex de email (Desenvolvido pelo Github Copilot)
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      const emailIsValid = emailRegex.test(v)

      if (!emailIsValid) {
        ctx.message = 'Email inválido'

        return false
      }

      return true
    }
  },
  addresses: {
    required: true,
    transform: (v) =>
      v.map(({ key, value }: any) => ({
        key,
        value: value.replace(/\W+/g, '')
      })),
    validator(ctx, v) {
      for (const { key, value } of v) {
        if (!key || !value) {
          ctx.message = 'Defina ao menos um endereço'

          return false
        }

        if (!Number(value)) {
          ctx.message = 'CEP deve ser um número'

          return false
        }

        if (value.length !== 8) {
          ctx.message = 'CEP inválido'

          return false
        }
      }

      return true
    }
  }
}

const immutableAddFormData = Object.assign({}, addFormData)

const addFormAddressesSize = $computed(() => addFormData.addresses.length)

const addProfileOptionsData = $ref([
  { label: 'Usuário', value: 'user' },
  { label: 'Administrador', value: 'admin' }
])

const allowCpfInput = (v: string) => Number(v) === 0 || !!Number(v) || !v

const allowNameInput = (v: string) => !Number(v) || !v

// !SECTION

// ANCHOR - Métodos

let { data, error, isLoading, execute } = useAxios<any[]>('/', {
  baseURL: 'http://localhost:8000/api/users',
  params: {
    page: 1,
    perPage: 8
  },
  transformResponse(data) {
    const parseData: any[] = JSON.parse(data)

    return parseData.map(
      ({
        updated_at,
        uuid,
        profile_uuid,
        profile_name,
        ...rest
      }: UserData & { profile_name: string }) => ({
        id: uuid,
        profile: profile_name,
        ...rest
      })
    )
  }
})

const filteredData = $computed(() =>
  data.value?.filter(
    ({ name, cpf, created_at }) =>
      name.toLowerCase().startsWith(searchFormData.name.toLowerCase()) &&
      cpf.startsWith(searchFormData.cpf) &&
      (searchFormData.created_at
        ? new Date(created_at) >= new Date(searchFormData.created_at[0]) &&
          new Date(created_at) <= new Date(searchFormData.created_at[1])
        : true)
  )
)

watch(error, () => {
  console.error(error.value)
  message.error(error.value!.message)
})

async function handleSubmitAddForm() {
  await addFormRef.value?.validate(async (errs) => {
    if (errs) {
      return message.error('Preencha todos os campos')
    } else {
      try {
        toggleIsLoadingAddForm()

        const { status, data } = await $axios.post('/users/create', {
          ...addFormData,
          addresses: addFormData.addresses.map(({ key, value }) => ({ address: key, cep: value }))
        })

        if (status === 400) {
          throw new Error(data.message)
        }

        if (status === 500) {
          throw new Error('Erro interno do servidor')
        }

        message.success('Usuário adicionado com sucesso')

        addFormData = immutableAddFormData
      } catch (err) {
        console.error(err)

        if (err instanceof AxiosError) {
          console.log(err.response?.data.message)

          return message.error(err.response?.data.message || 'Erro interno do servidor')
        }

        if (err instanceof Error) {
          console.log(err.message)

          return message.error(err.message)
        }
      } finally {
        toggleIsLoadingAddForm()
      }
    }
  })
}

async function handleSearchPage(page: number) {
  await execute({
    params: {
      page,
      perPage: 8
    }
  })
}

const disabledFutureDate = (ts: number) => ts > Date.now()
</script>
