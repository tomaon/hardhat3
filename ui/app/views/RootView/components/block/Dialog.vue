<template>
  <header>
    <h2>Block</h2>
    <h3>#{{ props.blockNumber }}</h3>
  </header>
  <div v-if="error" class="error">{{ error }}</div>
  <dl v-else>
    <template v-if="block">
      <div>
        <dt>baseFeePerGas</dt>
        <dd class="pending">{{ block.baseFeePerGas?.toString() ?? "null" }}</dd>
      </div>
      <div>
        <dt>blobGasUsed</dt>
        <dd class="pending">{{ block.blobGasUsed.toString() }}</dd>
      </div>
      <div>
        <dt>difficulty</dt>
        <dd class="pending">{{ block.difficulty.toString() }}</dd>
      </div>
      <div>
        <dt>excessBlobGas</dt>
        <dd class="pending">{{ block.excessBlobGas.toString() }}</dd>
      </div>
      <div>
        <dt>extraData</dt>
        <dd class="pending">{{ block.extraData }}</dd>
      </div>
      <div>
        <dt>gasLimit</dt>
        <dd>{{ formatNumber(block.gasLimit) }}</dd>
      </div>
      <div>
        <dt>gasUsed</dt>
        <dd>{{ formatNumber(block.gasUsed) }}</dd>
      </div>
      <div>
        <dt>hash</dt>
        <dd class="pending">{{ block.hash ?? "null" }}</dd>
      </div>
      <div>
        <dt>logsBloom</dt>
        <dd class="pending">{{ block.logsBloom ?? "null" }}</dd>
      </div>
      <div>
        <dt>miner</dt>
        <dd>{{ block.miner }}</dd>
      </div>
      <div>
        <dt>mixHash</dt>
        <dd class="pending">{{ block.mixHash }}</dd>
      </div>
      <div>
        <dt>nonce</dt>
        <dd class="pending">{{ block.nonce ?? "null" }}</dd>
      </div>
      <div>
        <dt>number</dt>
        <dd>{{ block.number?.toString() ?? "null" }}</dd>
      </div>
      <div>
        <dt>parentBeaconBlockRoot</dt>
        <dd class="pending">{{ block.parentBeaconBlockRoot ?? "null" }}</dd>
      </div>
      <div>
        <dt>parentHash</dt>
        <dd class="pending">{{ block.parentHash }}</dd>
      </div>
      <div>
        <dt>receiptsRoot</dt>
        <dd class="pending">{{ block.receiptsRoot }}</dd>
      </div>
      <div>
        <dt>sha3Uncles</dt>
        <dd class="pending">{{ block.sha3Uncles }}</dd>
      </div>
      <div>
        <dt>size</dt>
        <dd>{{ formatNumber(block.size) }} bytes</dd>
      </div>
      <div>
        <dt>stateRoot</dt>
        <dd class="pending">{{ block.stateRoot }}</dd>
      </div>
      <div>
        <dt>timestamp</dt>
        <dd>{{ formatDateTime(Number(block.timestamp) * 1000) }}</dd>
      </div>
      <div>
        <dt>totalDifficulty</dt>
        <dd class="pending">
          {{ block.totalDifficulty?.toString() ?? "null" }}
        </dd>
      </div>
      <div>
        <dt>transactions</dt>
        <dd class="pending">n={{ block.transactions.length }}</dd>
      </div>
      <div>
        <dt>transactionsRoot</dt>
        <dd class="pending">{{ block.transactionsRoot }}</dd>
      </div>
      <div>
        <dt>uncles</dt>
        <dd class="pending">n={{ block.uncles?.length || 0 }}</dd>
      </div>
      <div>
        <dt>withdrawals</dt>
        <dd class="pending">n={{ block.withdrawals?.length ?? 0 }}</dd>
      </div>
      <div>
        <dt>withdrawalsRoot</dt>
        <dd class="pending">{{ block.withdrawalsRoot ?? "null" }}</dd>
      </div>
    </template>
  </dl>
</template>

<script lang="ts" setup>
import { type GetBlockReturnType } from "viem";
import { onMounted, ref } from "vue";

import { formatDateTime, formatNumber } from "../../../../utils/index.ts";
import { publicClient, toMessage } from "../../../../utils/viem.ts";

const props = defineProps<{
  blockNumber: string;
}>();

const block = ref<GetBlockReturnType>();
const error = ref<string>();

onMounted(async () => {
  try {
    // blockNumber は chain の height = 位置情報で単調増加する値 <-> hash
    // pending -> latest -> safe -> finalized と進む間に blockNumber が指すブロックは差し替わる、かも
    // 確定した hash は不変なので reorg 後も残る、がアクセスできなくなるかも
    block.value = await publicClient.getBlock({
      blockNumber: BigInt(props.blockNumber),
    });
  } catch (reason: unknown) {
    error.value = toMessage(reason);
  }
});
</script>
