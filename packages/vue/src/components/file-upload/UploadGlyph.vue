<template>
  <!-- The arrow leaves its tray when the `group/zone` around it is hovered. -->
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 15v3a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 18v-3" />
    <path
      class="transition-[translate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none group-hover/zone:group-not-data-disabled/zone:-translate-y-[1.5px]"
      d="M12 15V4.5M7.5 8.5 12 4l4.5 4.5"
    />
  </svg>
</template>
