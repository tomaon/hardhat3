<template>
  <header>
    <h2>Transaction</h2>
    <h3>{{ props.hash }}</h3>
  </header>
  <div v-if="error" class="error">{{ error }}</div>
  <dl v-else>
    <template v-if="transaction">
      <div>
        <dt>blockHash</dt>
        <dd class="pending">{{ transaction.blockHash ?? "null" }}</dd>
      </div>
      <div>
        <dt>blockNumber</dt>
        <dd class="pending">
          {{ transaction.blockNumber?.toString() ?? "null" }}
        </dd>
      </div>
      <div>
        <dt>from</dt>
        <dd>{{ transaction.from }}</dd>
      </div>
      <div>
        <dt>gas</dt>
        <dd>{{ formatNumber(transaction.gas) }}</dd>
      </div>
      <div>
        <dt>hash</dt>
        <dd>{{ transaction.hash }}</dd>
      </div>
      <div>
        <dt>input</dt>
        <dd class="pending">{{ transaction.input }}</dd>
      </div>
      <div>
        <dt>nonce</dt>
        <dd>{{ transaction.nonce }}</dd>
      </div>
      <div>
        <dt>r</dt>
        <dd class="pending">{{ transaction.r }}</dd>
      </div>
      <div>
        <dt>s</dt>
        <dd class="pending">{{ transaction.s }}</dd>
      </div>
      <div>
        <dt>to</dt>
        <dd>{{ transaction.to ?? "null" }}</dd>
      </div>
      <div>
        <dt>transactionIndex</dt>
        <dd class="pending">
          {{ transaction.transactionIndex?.toString() ?? "null" }}
        </dd>
      </div>
      <div>
        <dt>typeHex</dt>
        <dd class="pending">{{ transaction.typeHex ?? "null" }}</dd>
      </div>
      <div>
        <dt>v</dt>
        <dd class="pending">{{ transaction.v.toString() }}</dd>
      </div>
      <div>
        <dt>value</dt>
        <dd>{{ formatEther(transaction.value) }}</dd>
      </div>
      <div>
        <dt>yParity</dt>
        <dd class="pending">{{ transaction.yParity }}</dd>
      </div>

      <div
        v-if="
          ['eip1559', 'eip2930', 'eip4844', 'eip7702'].includes(
            transaction.type,
          )
        "
      >
        <dt>accessList</dt>
        <dd class="pending">n={{ transaction.accessList?.length || 0 }}</dd>
      </div>
      <div v-if="['eip7702'].includes(transaction.type)">
        <dt>authorizationList</dt>
        <dd class="pending">
          n={{ transaction.authorizationList?.length || 0 }}
        </dd>
      </div>
      <div v-if="['eip4844'].includes(transaction.type)">
        <dt>blobVersionedHashes</dt>
        <dd class="pending">
          n={{ transaction.blobVersionedHashes?.length || 0 }}
        </dd>
      </div>
      <div>
        <dt>chainId</dt>
        <dd class="pending">{{ transaction.chainId || "null" }}</dd>
      </div>
      <div v-if="['legacy'].includes(transaction.type)">
        <dt>gasPrice</dt>
        <dd class="pending">
          {{ transaction.gasPrice?.toString() ?? "null" }}
        </dd>
      </div>
      <div v-if="['eip1559', 'eip4844'].includes(transaction.type)">
        <dt>maxFeePerGas</dt>
        <dd class="pending">
          {{ transaction.maxFeePerGas?.toString() ?? "null" }}
        </dd>
      </div>
      <div v-if="['eip1559', 'eip4844'].includes(transaction.type)">
        <dt>maxPriorityFeePerGas</dt>
        <dd class="pending">
          {{ transaction.maxPriorityFeePerGas?.toString() ?? "null" }}
        </dd>
      </div>
      <div v-if="['eip4844'].includes(transaction.type)">
        <dt>maxFeePerBlobGas</dt>
        <dd class="pending">
          {{ transaction.maxFeePerBlobGas?.toString() ?? "null" }}
        </dd>
      </div>
      <div>
        <dt>type</dt>
        <dd>{{ transaction.type }}</dd>
      </div>
    </template>
    <template v-if="transactionReceipt">
      <div>
        <dt>blobGasPrice</dt>
        <dd class="pending">
          {{ transactionReceipt.blobGasPrice?.toString() ?? "null" }}
        </dd>
      </div>
      <div>
        <dt>blobGasUsed</dt>
        <dd class="pending">
          {{ transactionReceipt.blobGasUsed?.toString() ?? "null" }}
        </dd>
      </div>
      <div>
        <dt>blockHash</dt>
        <dd class="pending">{{ transactionReceipt.blockHash }}</dd>
      </div>
      <div>
        <dt>blockNumber</dt>
        <dd class="pending">{{ transactionReceipt.blockNumber.toString() }}</dd>
      </div>
      <div>
        <dt>contractAddress</dt>
        <dd>
          {{ transactionReceipt.contractAddress ?? "null" }}
        </dd>
      </div>
      <div>
        <dt>cumulativeGasUsed</dt>
        <dd class="pending">
          {{ transactionReceipt.cumulativeGasUsed?.toString() ?? "null" }}
        </dd>
      </div>
      <div>
        <dt>effectiveGasPrice</dt>
        <dd class="pending">
          {{ transactionReceipt.effectiveGasPrice?.toString() ?? "null" }}
        </dd>
      </div>
      <div>
        <dt>from</dt>
        <dd class="pending">{{ transactionReceipt.from }}</dd>
      </div>
      <div>
        <dt>gasUsed</dt>
        <dd class="pending">
          {{ transactionReceipt.gasUsed?.toString() ?? "null" }}
        </dd>
      </div>
      <div>
        <dt>logs</dt>
        <dd class="pending">n={{ transactionReceipt.logs.length }}</dd>
      </div>
      <div>
        <dt>logsBloom</dt>
        <dd class="pending">{{ transactionReceipt.logsBloom }}</dd>
      </div>
      <div>
        <dt>root</dt>
        <dd class="pending">{{ transactionReceipt.root ?? "null" }}</dd>
      </div>
      <div>
        <dt>status</dt>
        <dd>{{ transactionReceipt.status }}</dd>
      </div>
      <div>
        <dt>to</dt>
        <dd class="pending">{{ transactionReceipt.to ?? "null" }}</dd>
      </div>
      <div>
        <dt>transactionHash</dt>
        <dd class="pending">{{ transactionReceipt.transactionHash }}</dd>
      </div>
      <div>
        <dt>transactionIndex</dt>
        <dd class="pending">{{ transactionReceipt.transactionIndex }}</dd>
      </div>
      <div>
        <dt>type</dt>
        <dd>{{ transactionReceipt.type }}</dd>
      </div>
    </template>
  </dl>
</template>

<script lang="ts" setup>
import {
  type Hash,
  type GetTransactionReturnType,
  type GetTransactionReceiptReturnType,
  formatEther,
} from "viem";
import { onMounted, ref } from "vue";

import { formatNumber } from "../../../../utils/index.ts";
import { publicClient, toMessage } from "../../../../utils/viem.ts";

const props = defineProps<{
  hash: string;
}>();

const transaction = ref<GetTransactionReturnType>();
const transactionReceipt = ref<GetTransactionReceiptReturnType>();
const error = ref<string>();

onMounted(async () => {
  try {
    [transaction.value, transactionReceipt.value] = await Promise.all([
      publicClient.getTransaction({
        hash: props.hash as Hash,
      }),
      publicClient.getTransactionReceipt({
        hash: props.hash as Hash,
      }),
    ]);
  } catch (reason: unknown) {
    error.value = toMessage(reason);
  }
});
</script>
