<script setup lang="ts">
import { computed, ref, toRef, useId } from 'vue'
import { cn, useControllableState } from '@ousi-ui/core'
import { OChip } from '../chip'
import {
  tagInputWrapperTheme,
  tagInputGroupTheme,
  tagInputInputTheme,
  tagInputLabelTheme,
} from './tag-input.theme'
import type { TagInputProps, TagInputEmits } from './tag-input.types'

const props = withDefaults(defineProps<TagInputProps>(), {
  size: 'md',
  color: 'accent',
  variant: 'primary',
  allowDuplicates: false,
  disabled: false,
  required: false,
})

const emit = defineEmits<TagInputEmits>()

const inputId = useId()
const descId = useId()
const errorId = useId()

const tags = useControllableState<string[]>({
  prop: toRef(props, 'modelValue'),
  defaultValue: props.defaultValue ?? [],
  onChange: (val) => emit('update:modelValue', val),
})

const inputValue = ref('')

const isInvalid = computed(() => !!props.errorMessage)
const describedBy = computed(() =>
  isInvalid.value ? errorId : props.description ? descId : undefined,
)

// Map TagInput size to Chip size
const chipSize = computed((): 'sm' | 'md' | 'lg' => {
  const map: Record<string, 'sm' | 'md' | 'lg'> = { sm: 'sm', md: 'sm', lg: 'md' }
  return map[props.size] ?? 'sm'
})

function addTag(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return
  if (!props.allowDuplicates && tags.value.includes(trimmed)) return
  if (props.maxTags !== undefined && tags.value.length >= props.maxTags) return
  tags.value = [...tags.value, trimmed]
  emit('add', trimmed)
}

function removeTag(tag: string) {
  const index = tags.value.indexOf(tag)
  if (index === -1) return
  const next = [...tags.value]
  next.splice(index, 1)
  tags.value = next
  emit('remove', tag)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag(inputValue.value)
    inputValue.value = ''
  } else if (e.key === 'Backspace' && inputValue.value === '' && tags.value.length > 0) {
    removeTag(tags.value[tags.value.length - 1])
  }
}

function handleInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (val.includes(',')) {
    for (const part of val.split(',')) addTag(part)
    inputValue.value = ''
    return
  }
  inputValue.value = val
}
</script>

<template>
  <div :class="cn(tagInputWrapperTheme({ fullWidth: true }), props.class)">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      :class="tagInputLabelTheme({ required, disabled, invalid: isInvalid })"
    >
      {{ label }}
    </label>

    <!-- Field group -->
    <div
      :class="tagInputGroupTheme({ variant, size })"
      :data-invalid="isInvalid || undefined"
      :data-disabled="disabled || undefined"
      role="list"
    >
      <!-- Tags as OChip components -->
      <OChip
        v-for="(tag, index) in tags"
        :key="`${tag}-${index}`"
        :color="color"
        variant="soft"
        :size="chipSize"
        role="listitem"
      >
        <slot name="tag" :tag="tag" :index="index" :remove="() => removeTag(tag)">
          {{ tag }}
        </slot>
        <template #end>
          <button
            v-if="!disabled"
            type="button"
            class="inline-flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity rounded-full"
            :aria-label="`Remove ${tag}`"
            @click.stop="removeTag(tag)"
          >
            <svg
              class="size-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </template>
      </OChip>

      <!-- Input -->
      <input
        :id="inputId"
        :name="name"
        :class="tagInputInputTheme({ size })"
        :value="inputValue"
        :placeholder="tags.length === 0 ? placeholder : undefined"
        :disabled="disabled"
        :aria-describedby="describedBy"
        :aria-invalid="isInvalid || undefined"
        type="text"
        @input="handleInput"
        @keydown="handleKeydown"
      />
    </div>

    <!-- Description -->
    <p v-if="description && !errorMessage" :id="descId" class="text-xs text-ousi-muted">
      {{ description }}
    </p>

    <!-- Error -->
    <p v-if="errorMessage" :id="errorId" class="text-xs text-ousi-danger" role="alert" aria-live="polite">
      {{ errorMessage }}
    </p>
  </div>
</template>
