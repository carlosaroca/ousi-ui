<script setup lang="ts">
import { OCard, OButton, OAvatar } from '@ousi-ui/vue'
</script>
<template>
  <div class="grid w-full max-w-2xl grid-cols-12 gap-4">
    <!-- Row 1: Banner -->
    <OCard class="col-span-12 flex-col sm:flex-row min-h-[152px]">
      <div class="relative h-[140px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]">
        <img alt="Cherries" class="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none" loading="lazy" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg" />
      </div>
      <div class="flex flex-1 flex-col gap-3">
        <OCard.Header class="gap-1">
          <OCard.Title class="pr-8">Become an ACME Creator!</OCard.Title>
          <OCard.Description>Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam dolor sed amet faucibus etiam.</OCard.Description>
        </OCard.Header>
        <OCard.Footer class="mt-auto flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col">
            <span class="text-sm font-medium text-ousi-foreground">Only 10 spots</span>
            <span class="text-xs text-ousi-muted">Submission ends Oct 10.</span>
          </div>
          <OButton class="w-full sm:w-auto">Apply Now</OButton>
        </OCard.Footer>
      </div>
    </OCard>

    <!-- Row 2 -->
    <div class="col-span-12 grid grid-cols-12 gap-4">
      <!-- Left column -->
      <div class="col-span-12 grid grid-cols-12 gap-4 lg:col-span-6">
        <!-- Payment card -->
        <OCard class="col-span-12">
          <OCard.Header class="gap-3 flex-row">
            <svg class="text-ousi-accent size-8 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium text-ousi-muted uppercase">Payment</span>
              <OCard.Title class="pr-8 text-sm sm:text-base">You can now withdraw on crypto</OCard.Title>
              <OCard.Description class="text-xs sm:text-sm">Add your wallet in settings to withdraw</OCard.Description>
            </div>
          </OCard.Header>
          <OCard.Footer>
            <a href="#" class="text-sm text-ousi-accent flex items-center gap-1 hover:underline">
              Go to settings
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </a>
          </OCard.Footer>
        </OCard>

        <!-- Community cards -->
        <div class="col-span-12 grid grid-cols-12 gap-4">
          <OCard class="col-span-12 gap-2 sm:col-span-6">
            <OCard.Header>
              <OAvatar src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg" alt="Indie Hackers" shape="square" size="xl" class="rounded-xl !h-14 !w-14" />
            </OCard.Header>
            <OCard.Content class="mt-1">
              <p class="text-sm leading-4 font-medium text-ousi-foreground">Indie Hackers</p>
              <p class="text-xs text-ousi-muted">148 members</p>
            </OCard.Content>
            <OCard.Footer class="gap-2">
              <OAvatar src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg" alt="John" size="sm" class="!h-4 !w-4" />
              <p class="text-xs text-ousi-muted">By John</p>
            </OCard.Footer>
          </OCard>
          <OCard class="col-span-12 gap-2 sm:col-span-6">
            <OCard.Header>
              <OAvatar src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo2.jpg" alt="AI Builders" shape="square" size="xl" class="rounded-xl !h-14 !w-14" />
            </OCard.Header>
            <OCard.Content class="mt-1">
              <p class="text-sm leading-4 font-medium text-ousi-foreground">AI Builders</p>
              <p class="text-xs text-ousi-muted">362 members</p>
            </OCard.Content>
            <OCard.Footer class="gap-2">
              <OAvatar src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" alt="Martha" size="sm" class="!h-4 !w-4" />
              <p class="text-xs text-ousi-muted">By Martha</p>
            </OCard.Footer>
          </OCard>
        </div>
      </div>

      <!-- Right: Full image card -->
      <OCard class="col-span-12 min-h-[200px] overflow-hidden rounded-3xl lg:col-span-6">
        <img alt="NEO Home Robot" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo2.jpeg" />
        <OCard.Header class="z-10">
          <OCard.Title class="text-xs font-semibold tracking-wide text-black/70">NEO</OCard.Title>
          <OCard.Description class="text-sm leading-5 font-medium text-black/50">Home Robot</OCard.Description>
        </OCard.Header>
        <OCard.Footer class="z-10 mt-auto justify-between">
          <div>
            <div class="text-sm font-medium text-black">Available soon</div>
            <div class="text-xs text-black/60">Get notified</div>
          </div>
          <OButton size="sm" class="bg-white text-black hover:bg-white/90">Notify me</OButton>
        </OCard.Footer>
      </OCard>
    </div>

    <!-- Row 3 -->
    <div class="col-span-12 grid grid-cols-12 gap-4">
      <!-- Left: Large image card -->
      <OCard class="relative col-span-12 h-[250px] sm:h-[300px] md:col-span-8 md:h-[350px]">
        <img alt="NEO Robot" aria-hidden="true" class="absolute inset-0 h-full w-full object-cover" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/neo1.jpeg" />
        <OCard.Footer class="z-10 mt-auto items-end justify-between">
          <div>
            <div class="text-base font-medium text-black sm:text-lg">NEO</div>
            <div class="text-xs font-medium text-black/50 sm:text-sm">$499/m</div>
          </div>
          <OButton size="sm" class="bg-white text-black hover:bg-white/90">Get now</OButton>
        </OCard.Footer>
      </OCard>

      <!-- Right: Events stack -->
      <div class="col-span-12 flex flex-col gap-2 md:col-span-4 md:justify-between md:gap-0 md:py-2">
        <OCard class="flex-row gap-3 p-1" variant="transparent">
          <img alt="Futuristic Robot" class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20" loading="lazy" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg" />
          <div class="flex flex-1 flex-col justify-center gap-1">
            <OCard.Title class="text-sm">Bridging the Future</OCard.Title>
            <OCard.Description class="text-xs">Today, 6:30 PM</OCard.Description>
          </div>
        </OCard>
        <OCard class="flex-row gap-3 p-1" variant="transparent">
          <img alt="Avocado" class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20" loading="lazy" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg" />
          <div class="flex flex-1 flex-col justify-center gap-1">
            <OCard.Title class="text-sm">Avocado Hackathon</OCard.Title>
            <OCard.Description class="text-xs">Wed, 4:30 PM</OCard.Description>
          </div>
        </OCard>
        <OCard class="flex-row gap-3 p-1" variant="transparent">
          <img alt="Sound Electro" class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20" loading="lazy" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg" />
          <div class="flex flex-1 flex-col justify-center gap-1">
            <OCard.Title class="text-sm">Sound Electro | Beyond art</OCard.Title>
            <OCard.Description class="text-xs">Fri, 8:00 PM</OCard.Description>
          </div>
        </OCard>
      </div>
    </div>
  </div>
</template>
