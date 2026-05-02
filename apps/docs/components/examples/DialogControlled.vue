<script setup lang="ts">
import { ref } from 'vue'
import { ODialog, ODialogHeader, ODialogBody, ODialogFooter, OButton, OTextarea } from '@ousi-ui/vue'

const open = ref(false)
const note = ref('Hey team — pushing the v0.2 release tomorrow morning. Final review needed on the dialog and button changes.')
const events = ref<{ ts: string; label: string }[]>([])

function log(label: string) {
  const ts = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  events.value.unshift({ ts, label })
  if (events.value.length > 6) events.value.pop()
}

function onOpen() { log('opened') }
function onClose() { log('closed') }
function save() { log('saved'); open.value = false }
</script>
<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <OButton @click="open = true">Compose update</OButton>
      <button class="text-xs text-ousi-muted underline underline-offset-2 hover:text-ousi-foreground" @click="events = []">
        Clear log
      </button>
    </div>

    <!-- Event log -->
    <div class="rounded-ousi-2xl border border-ousi-border bg-ousi-surface-secondary/40 px-3 py-2 min-h-[5rem]">
      <p class="text-[10px] font-semibold uppercase tracking-wider text-ousi-muted mb-1.5">Event log</p>
      <ul v-if="events.length" class="space-y-0.5 font-mono text-xs">
        <li v-for="(e, i) in events" :key="i" class="flex items-baseline gap-2">
          <span class="text-ousi-muted">{{ e.ts }}</span>
          <span class="text-ousi-foreground">{{ e.label }}</span>
        </li>
      </ul>
      <p v-else class="text-xs text-ousi-muted italic">Open the dialog to see events fire.</p>
    </div>
  </div>

  <ODialog v-model="open" size="md" @open="onOpen" @close="onClose">
    <ODialogHeader>
      <h2 class="text-base font-semibold text-ousi-foreground">Team update</h2>
      <p class="text-xs text-ousi-muted mt-0.5">Will be posted to #releases.</p>
    </ODialogHeader>
    <ODialogBody>
      <OTextarea v-model="note" :rows="5" auto-resize />
    </ODialogBody>
    <ODialogFooter>
      <OButton variant="text" @click="open = false">Cancel</OButton>
      <OButton @click="save">Post update</OButton>
    </ODialogFooter>
  </ODialog>
</template>
