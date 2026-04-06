<script setup lang="ts">
import { ref, computed, watch, nextTick, toRef, useId } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import {
  textareaWrapperTheme,
  textareaFieldTheme,
  textareaLabelTheme,
  textareaDescriptionTheme,
  textareaErrorTheme,
} from './textarea.theme'
import { useFormContext } from '../form/form.context'
import type { TextareaProps, TextareaEmits } from './textarea.types'

const props = withDefaults(defineProps<TextareaProps>(), {
  rows: 3,
  autoResize: false,
  resize: 'vertical',
  variant: 'primary',
  disabled: false,
  readonly: false,
  required: false,
  fullWidth: false,
})

const emit = defineEmits<TextareaEmits>()

const textareaId = useId()
const descId = useId()
const errorId = useId()
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const value = useControllableState<string>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? '',
  onChange: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const formCtx = useFormContext()

const resolvedError = computed(() => {
  if (props.errorMessage) return props.errorMessage
  if (props.name && formCtx?.validationErrors.value[props.name]) {
    const err = formCtx.validationErrors.value[props.name]
    return Array.isArray(err) ? err[0] : err
  }
  return undefined
})

const isInvalid = computed(() => !!resolvedError.value)

const describedBy = computed(() => {
  if (isInvalid.value) return errorId
  if (props.description) return descId
  return undefined
})

function adjustHeight() {
  if (!props.autoResize || !textareaRef.value) return
  const el = textareaRef.value
  el.style.height = 'auto'
  const scrollH = el.scrollHeight
  const lineHeight = parseInt(getComputedStyle(el).lineHeight) || 20
  const paddingY = parseInt(getComputedStyle(el).paddingTop) + parseInt(getComputedStyle(el).paddingBottom)
  const minH = props.minRows ? props.minRows * lineHeight + paddingY : 0
  const maxH = props.maxRows ? props.maxRows * lineHeight + paddingY : Infinity
  el.style.height = `${Math.min(Math.max(scrollH, minH), maxH)}px`
}

function handleInput(e: Event) {
  value.value = (e.target as HTMLTextAreaElement).value
  if (props.autoResize) nextTick(adjustHeight)
}

watch(() => value.value, () => {
  if (props.autoResize) nextTick(adjustHeight)
})
</script>

<template>
  <div :class="cn(textareaWrapperTheme({ fullWidth }), props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="textareaId"
      :class="textareaLabelTheme({
        required: required || undefined,
        disabled: disabled || undefined,
        invalid: isInvalid || undefined,
      })"
    >
      {{ label }}
    </label>

    <!-- Textarea -->
    <textarea
      :id="textareaId"
      ref="textareaRef"
      :name="name"
      :class="textareaFieldTheme({ variant, resize: autoResize ? 'none' : resize })"
      :value="value"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :aria-invalid="isInvalid || undefined"
      :aria-required="required || undefined"
      :aria-disabled="disabled || undefined"
      :aria-describedby="describedBy"
      :data-invalid="isInvalid || undefined"
      :data-disabled="disabled || undefined"
      @input="handleInput"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />

    <!-- Description -->
    <p v-if="description && !resolvedError" :id="descId" :class="textareaDescriptionTheme">
      {{ description }}
    </p>

    <!-- Error -->
    <p v-if="resolvedError" :id="errorId" :class="textareaErrorTheme" role="alert" aria-live="polite">
      {{ resolvedError }}
    </p>
  </div>
</template>
