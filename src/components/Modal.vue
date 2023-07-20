<template>
    <teleport to="body">
        <dialog :id="name" class="modal">
            <form method="dialog" class="modal-box flex flex-col gap-2">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    <Icon name="md-close"></Icon>
                </button>
                <slot />
                <div class="modal-action">
                    <slot name="action" />
                </div>
            </form>
        </dialog>
    </teleport>
</template>
<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
