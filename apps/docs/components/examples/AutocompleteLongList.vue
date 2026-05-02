<script setup lang="ts">
import { OAutocomplete } from '@ousi-ui/vue'

const countries = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil',
  'Canada', 'Chad', 'Chile', 'China', 'Christmas Island',
  'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Croatia', 'Cuba',
  'Czech Republic', 'Denmark', 'Ecuador', 'Egypt', 'Estonia',
  'Finland', 'France', 'Germany', 'Greece', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Ireland', 'Israel',
  'Italy', 'Japan', 'Mexico', 'Netherlands', 'New Zealand',
  'Norway', 'Peru', 'Poland', 'Portugal', 'Spain',
  'Sweden', 'Switzerland', 'United Kingdom', 'United States', 'Uruguay',
].map(name => ({ value: name.toLowerCase().replace(/[^a-z]/g, '-'), label: name }))
</script>
<template>
  <OAutocomplete :options="countries" placeholder="Search country..." />
</template>
