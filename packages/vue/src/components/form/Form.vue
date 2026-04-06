<script setup lang="ts">
import { ref, watch } from 'vue'
import { provideForm } from './form.context'
import type { FormProps, FormEmits } from './form.types'

const props = withDefaults(defineProps<FormProps>(), {
  method: 'post',
  validationBehavior: 'native',
  validationErrors: () => ({}),
})

const emit = defineEmits<FormEmits>()

const formRef = ref<HTMLFormElement | null>(null)

// Reactive server errors
const serverErrors = ref<Record<string, string | string[]>>({ ...props.validationErrors })

watch(
  () => props.validationErrors,
  (errors) => { serverErrors.value = errors ? { ...errors } : {} },
  { deep: true },
)

// Focus the first invalid field
function focusFirstInvalid() {
  if (!formRef.value) return
  const el = formRef.value.querySelector<HTMLElement>(
    'input:invalid, textarea:invalid, select:invalid, [aria-invalid="true"]',
  )
  el?.focus()
}

function handleSubmit(e: SubmitEvent) {
  emit('submit', e)
}

function handleInvalid(e: Event) {
  e.preventDefault()
  focusFirstInvalid()
  emit('invalid', e)
}

function handleReset(e: Event) {
  serverErrors.value = {}
  emit('reset', e)
}

provideForm({ validationErrors: serverErrors })
</script>

<template>
  <form
    ref="formRef"
    :action="action"
    :method="method"
    :enctype="encType"
    :target="target"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :class="props.class"
    novalidate
    @submit="handleSubmit"
    @reset="handleReset"
    @invalid.capture="handleInvalid"
  >
    <slot />
  </form>
</template>
