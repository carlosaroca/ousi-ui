<script setup lang="ts">
</script>

<template>
  <div class="w-full max-w-4xl">
    <OBentoGrid :cols="4" :gap="12">
      <OBentoGridItem :col-span="2" :row-span="2">
        <div class="flex flex-col h-full">
          <span class="text-xs font-medium text-ousi-accent uppercase tracking-wider">Analytics</span>
          <h3 class="text-lg font-bold text-ousi-foreground mt-1">Dashboard</h3>
          <div class="flex-1 flex items-end gap-1 mt-4">
            <div v-for="h in [40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95]" :key="h" class="flex-1 rounded-t-sm bg-ousi-accent/20" :style="{ height: h + '%' }" />
          </div>
        </div>
      </OBentoGridItem>
      <OBentoGridItem>
        <div class="text-center">
          <span class="text-3xl font-bold text-ousi-foreground">12.5k</span>
          <span class="text-xs text-ousi-muted block mt-1">Active Users</span>
        </div>
      </OBentoGridItem>
      <OBentoGridItem>
        <div class="text-center">
          <span class="text-3xl font-bold text-ousi-success">+24%</span>
          <span class="text-xs text-ousi-muted block mt-1">Growth Rate</span>
        </div>
      </OBentoGridItem>
      <OBentoGridItem :col-span="2">
        <div class="flex items-center justify-between h-full">
          <div>
            <span class="text-sm font-medium text-ousi-foreground">Recent Activity</span>
            <p class="text-xs text-ousi-muted mt-1">3 new deployments today</p>
          </div>
          <OBadge color="success">Live</OBadge>
        </div>
      </OBentoGridItem>
    </OBentoGrid>
  </div>
</template>
