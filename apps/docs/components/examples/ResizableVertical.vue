<script setup lang="ts">
</script>

<template>
  <div class="w-full max-w-md rounded-ousi-xl border border-ousi-border overflow-hidden" style="height: 350px">
    <OResizable direction="vertical" :default-size="60" :min-size="30" :max-size="80">
      <template #first>
        <div class="h-full bg-ousi-surface p-4">
          <span class="text-xs font-semibold text-ousi-muted uppercase tracking-wider">Editor</span>
          <div class="mt-2 font-mono text-xs text-ousi-foreground/80 leading-relaxed">
            <div><span class="text-ousi-accent">const</span></div>
            <div>&nbsp;&nbsp;greeting = <span class="text-ousi-success">'Hello'</span></div>
            <div><span class="text-ousi-accent">console</span>.log(greeting)</div>
          </div>
        </div>
      </template>
      <template #second>
        <div class="h-full bg-ousi-foreground/5 p-4">
          <span class="text-xs font-semibold text-ousi-muted uppercase tracking-wider">Terminal</span>
          <div class="mt-2 font-mono text-xs text-ousi-success/80">
            $ Hello
          </div>
        </div>
      </template>
    </OResizable>
  </div>
</template>
