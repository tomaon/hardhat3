<template>
  <header>
    <h2>Address</h2>
    <h3>{{ props.address }}</h3>
  </header>
  <div v-if="error" class="error">{{ error }}</div>
  <dl v-else>
    <div>
      <dt>type</dt>
      <dd>{{ addressType }}</dd>
    </div>
    <div>
      <dt>balance</dt>
      <dd>{{ formatEther(balance) }}</dd>
    </div>
    <div>
      <dt>transactionCount</dt>
      <dd>{{ formatNumber(transactionCount) }}</dd>
    </div>
  </dl>
</template>

<script lang="ts" setup>
import {
  type Address,
  type GetBalanceReturnType,
  type GetCodeReturnType,
  type GetTransactionCountReturnType,
  formatEther,
} from "viem";
import { onMounted, ref } from "vue";

import { formatNumber } from "../../../../utils/index.ts";
import {
  isPrecompiled,
  publicClient,
  toMessage,
} from "../../../../utils/viem.ts";

const props = defineProps<{
  address: string;
}>();

const addressType = ref<string>("Empty");
const balance = ref<GetBalanceReturnType>(0n);
const code = ref<GetCodeReturnType>();
const transactionCount = ref<GetTransactionCountReturnType>(0);
const error = ref<string>();

onMounted(async () => {
  try {
    const addr = props.address as Address;

    if (isPrecompiled(addr)) {
      addressType.value = "Precompiled";
      return;
    }

    [
      balance.value,
      code.value,
      transactionCount.value, // balance=0&&transactionCount=0 のアカウントもいるだろうが。。
    ] = await Promise.all([
      publicClient.getBalance({ address: addr }),
      publicClient.getCode({ address: addr }),
      publicClient.getTransactionCount({ address: addr }),
    ]);

    if (code.value) {
      addressType.value = "Contract";
      return;
    }

    // 秘密鍵の存在を確認する手段はない、らしい
    if (balance.value > 0n || transactionCount.value > 0) {
      addressType.value = "EOA"; // Externally Owned Account
      return;
    }
  } catch (reason: unknown) {
    error.value = toMessage(reason);
  }
});
</script>
