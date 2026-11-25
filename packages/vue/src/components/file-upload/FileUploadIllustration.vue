<script setup lang="ts">
import { cn } from '@ousi-ui/core'
import FileTypeIcon from './FileTypeIcon.vue'
import UploadGlyph from './UploadGlyph.vue'
import { fileUploadFanTheme, fileUploadIconTheme } from './file-upload.theme'
import type { FileUploadSize } from './file-upload.types'

// Two sheets behind a button. They open like a fan when the pointer or the keyboard reaches the
// drop area, and open further while a file is dragged over it. The area is the `group/zone`.
defineProps<{ size: FileUploadSize; active: boolean; disabled: boolean }>()
</script>

<template>
  <span aria-hidden="true" :class="fileUploadIconTheme({ size, active, disabled })" data-slot="file-upload-illustration">
    <span :class="fileUploadFanTheme({ side: 'left', disabled })">
      <FileTypeIcon kind="doc" />
    </span>
    <span :class="fileUploadFanTheme({ side: 'right', disabled })">
      <FileTypeIcon kind="image" />
    </span>
    <span :class="cn(fileUploadFanTheme({ side: 'front', disabled }), active && 'text-ousi-accent')">
      <UploadGlyph class="size-[1.125rem]" />
    </span>
  </span>
</template>
