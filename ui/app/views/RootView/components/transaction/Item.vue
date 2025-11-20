<template>
  <td>
    <div>
      <a href="#" :title="props.hash" @click.prevent="onClick">
        {{ formatHash(props.hash) }}
      </a>
    </div>
    <div class="datetime">{{ formatDateTime(props.timestamp) }}</div>
  </td>
  <td>
    <dl>
      <dt>from:</dt>
      <dd>
        <a href="#" :title="props.from" @click.prevent="onClick">
          {{ formatHash(props.from) }}
        </a>
      </dd>
      <dt>to:</dt>
      <dd>
        <a v-if="props.to" href="#" :title="props.to" @click.prevent="onClick">
          {{ formatHash(props.to) }}
        </a>
      </dd>
    </dl>
  </td>
  <td>{{ props.value }} {{ meta.nativeCurrencySymbol }}</td>
</template>

<script lang="ts" setup>
import { formatDateTime } from "../../../../utils/index.ts";
import { formatHash, getChainMetadata } from "../../../../utils/viem.ts";
import type { TransactionData } from "../../../../workers/viem/index.ts";

const props = defineProps<TransactionData>();

const emit = defineEmits<{
  change: [string];
}>();

const meta = getChainMetadata();

function onClick(event: MouseEvent) {
  emit("change", (event.target as HTMLElement).title);
}
</script>
