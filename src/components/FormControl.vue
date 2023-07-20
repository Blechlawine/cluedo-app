<template>
    <div class="form-control w-full max-w-xs">
        <label class="label">
            <span class="label-text">{{ label }}</span>
        </label>
        <slot />
    </div>
</template>
<script setup lang="ts">
defineProps<{
    label: string;
}>();
</script>
