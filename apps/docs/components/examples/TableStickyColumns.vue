<script setup lang="ts">
import { OTable } from '@ousi-ui/vue'
import type { TableColumn } from '@ousi-ui/vue'

const columns: TableColumn[] = [
  { key: 'id',     label: '#',      width: 56,  sticky: 'left' },
  { key: 'name',   label: 'Name',   width: 150, sticky: 'left' },
  { key: 'team',   label: 'Team',   width: 110 },
  { key: 'role',   label: 'Role',   width: 170 },
  { key: 'email',  label: 'Email',  width: 200 },
  { key: 'phone',  label: 'Phone',  width: 140 },
  { key: 'city',   label: 'City',   width: 130 },
  { key: 'joined', label: 'Joined', width: 110 },
  { key: 'salary', label: 'Salary', width: 96,  sticky: 'right', align: 'right' },
]

const rows = [
  { id: 1, name: 'Lin Wei',       team: 'Apollo',  role: 'Designer',        email: 'lin@oasiui.dev',     phone: '+1 555 0001', city: 'Madrid',        joined: 'Feb 2024', salary: '$92k' },
  { id: 2, name: 'Marcus Chen',   team: 'Mercury', role: 'Senior Engineer', email: 'marcus@oasiui.dev',  phone: '+1 555 0002', city: 'Toronto',       joined: 'Aug 2022', salary: '$140k' },
  { id: 3, name: 'Priya Patel',   team: 'Gemini',  role: 'Product Manager', email: 'priya@oasiui.dev',   phone: '+1 555 0003', city: 'Mumbai',        joined: 'Apr 2023', salary: '$118k' },
  { id: 4, name: 'Sofía Méndez',  team: 'Apollo',  role: 'Engineer',        email: 'sofia@oasiui.dev',   phone: '+1 555 0004', city: 'Buenos Aires',  joined: 'Jan 2026', salary: '$96k' },
  { id: 5, name: 'Diego Romero',  team: 'Mercury', role: 'Engineer',        email: 'diego@oasiui.dev',   phone: '+1 555 0005', city: 'Bogotá',        joined: 'Sep 2025', salary: '$98k' },
  { id: 6, name: 'Hiro Tanaka',   team: 'Gemini',  role: 'Designer',        email: 'hiro@oasiui.dev',    phone: '+1 555 0006', city: 'Tokyo',         joined: 'Mar 2024', salary: '$104k' },
]
</script>
<template>
  <div class="space-y-3">
    <p class="text-xs text-ousi-muted">
      Scroll the table horizontally. The first two columns (<strong>#</strong> and <strong>Name</strong>)
      stay pinned to the left, and <strong>Salary</strong> stays pinned to the right —
      each with a subtle 1px edge line when content scrolls behind.
    </p>
    <OTable :columns="columns" :rows="rows" />
  </div>
</template>
