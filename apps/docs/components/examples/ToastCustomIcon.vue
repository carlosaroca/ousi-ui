<script setup lang="ts">
import { OButton } from '@ousi-ui/vue'
import { toast } from '@ousi-ui/vue'
</script>
<template>
  <div class="flex items-center gap-3 flex-wrap">
    <OButton variant="secondary" size="sm" @click="toast('You have been invited to join a team', {
      description: 'Bob sent you an invitation',
      icon: '<path d=&quot;M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2&quot;/><circle cx=&quot;9&quot; cy=&quot;7&quot; r=&quot;4&quot;/><path d=&quot;M23 21v-2a4 4 0 0 0-3-3.87&quot;/><path d=&quot;M16 3.13a4 4 0 0 1 0 7.75&quot;/>',
      action: { label: 'Accept', onClick: () => {} },
    })">
      Team invite
    </OButton>
    <OButton variant="secondary" size="sm" @click="toast('You earned a star!', {
      icon: '<polygon points=&quot;12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2&quot;/>',
    })">
      Star icon
    </OButton>
    <OButton variant="secondary" size="sm" @click="toast.success('Download complete', {
      icon: '<path d=&quot;M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4&quot;/><polyline points=&quot;7 10 12 15 17 10&quot;/><line x1=&quot;12&quot; y1=&quot;15&quot; x2=&quot;12&quot; y2=&quot;3&quot;/>',
      description: 'report-2026.pdf saved to Downloads',
    })">
      Download icon
    </OButton>
  </div>
</template>
