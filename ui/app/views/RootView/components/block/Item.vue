<template>
  <td>
    <div>
      <a href="#" :title="props.number" @click.prevent="onClick">
        {{ props.number }}
      </a>
    </div>
    <div class="datetime">{{ formatDateTime(props.timestamp) }}</div>
  </td>
  <td>
    <a href="#" :title="props.miner" @click.prevent="onClick">
      {{ formatHash(props.miner) }}
    </a>
  </td>
  <td>
    <dl>
      <dt>txns:</dt>
      <dd class="number">{{ formatNumber(props.transactionCount) }}</dd>
      <dt>contracts:</dt>
      <dd class="number">{{ formatNumber(props.contractCount) }}</dd>
    </dl>
  </td>
</template>

<script lang="ts" setup>
import { formatDateTime, formatNumber } from "../../../../utils/index.ts";
import { formatHash } from "../../../../utils/viem.ts";
import type { BlockData } from "../../../../workers/viem/index.ts";

const props = defineProps<BlockData>();

const emit = defineEmits<{
  change: [string];
}>();

function onClick(event: MouseEvent) {
  emit("change", (event.target as HTMLElement).title);
}
</script>
