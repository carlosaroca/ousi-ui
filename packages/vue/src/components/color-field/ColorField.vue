<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { OInput } from '../input'
import { OColorSwatch } from '../color-swatch'
import type { ColorFieldProps, ColorFieldEmits } from './color-field.types'

const props = withDefaults(defineProps<ColorFieldProps>(), {
  format: 'hex',
  showSwatch: true,
  variant: 'primary',
  disabled: false,
  readonly: false,
  required: false,
  fullWidth: false,
})

const emit = defineEmits<ColorFieldEmits>()

const inputText = ref(props.modelValue ?? props.defaultValue ?? '')
const validColor = ref<string | null>(isValidColor(inputText.value) ? inputText.value : null)
const internalError = ref<string | null>(null)

watch(() => props.modelValue, (val) => {
  if (val !== undefined && val !== inputText.value) {
    inputText.value = val
    validColor.value = isValidColor(val) ? val : null
  }
})

const errorMessage = computed(() => props.errorMessage ?? internalError.value ?? undefined)

function isValidColor(color: string): boolean {
  if (!color.trim()) return false
  const s = new Option().style
  s.color = color
  return s.color !== ''
}

function toHex(color: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = color
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

function toRgb(color: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = color
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `rgb(${r}, ${g}, ${b})`
}

function normalize(color: string): string {
  if (props.format === 'hex') return toHex(color)
  if (props.format === 'rgb') return toRgb(color)
  return color
}

function handleInput(value: string | number) {
  const v = String(value)
  inputText.value = v
  internalError.value = null

  if (isValidColor(v)) {
    validColor.value = v
    const normalized = normalize(v)
    emit('update:modelValue', normalized)
    emit('change', normalized)
  } else {
    validColor.value = null
  }
}

function handleBlur() {
  if (!inputText.value.trim()) {
    internalError.value = null
    return
  }
  if (!isValidColor(inputText.value)) {
    internalError.value = 'Invalid color format'
    emit('invalidColor', inputText.value)
  } else {
    internalError.value = null
    const normalized = normalize(inputText.value)
    inputText.value = normalized
  }
}
</script>

<template>
  <OInput
    :model-value="inputText"
    :label="label"
    :description="description"
    :error-message="errorMessage"
    :variant="variant"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :full-width="fullWidth"
    :class="props.class"
    placeholder="#000000"
    @update:model-value="handleInput"
    @blur="handleBlur"
  >
    <template v-if="showSwatch" #start>
      <OColorSwatch
        :color="validColor ?? 'transparent'"
        shape="square"
        size="xs"
        class="rounded shrink-0"
      />
    </template>
  </OInput>
</template>
