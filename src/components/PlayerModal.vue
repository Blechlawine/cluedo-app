<template>
    <teleport to="body">
        <input type="checkbox" :checked="props.open" :id="props.label" class="modal-toggle" />
        <div class="modal">
            <div class="modal-box relative">
                <label :for="props.label" class="btn btn-sm btn-circle absolute right-2 top-2" @click="emit('close')">
                    <Icon name="md-close"></Icon>
                </label>
                <h3 class="text-lg font-bold">Create new player</h3>
            </div>
        </div>
    </teleport>
</template>
<script setup lang="ts">
const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["close"]);
</script>
