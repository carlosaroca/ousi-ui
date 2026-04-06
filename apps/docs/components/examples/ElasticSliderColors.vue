<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col gap-4 w-full max-w-md">
    <OElasticSlider color="primary" :default-value="60" />
    <OElasticSlider color="secondary" :default-value="60" />
    <OElasticSlider color="success" :default-value="60" />
    <OElasticSlider color="danger" :default-value="60" />
    <OElasticSlider color="warning" :default-value="60" />
  </div>
</template>
