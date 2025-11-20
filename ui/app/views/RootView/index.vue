<template>
  <header>
    <h1>{{ meta.name }}</h1>
    <form @submit.prevent="onSubmit">
      <input type="search" name="search" required />
    </form>
  </header>
  <div v-if="error" class="error">{{ error }}</div>
  <main>
    <section>
      <header>
        <h2>Latest Blocks</h2>
      </header>
      <BlockList @change="onChange" @error="onError" />
    </section>
    <section>
      <header>
        <h2>Latest Transactions</h2>
      </header>
      <TransactionList @change="onChange" @error="onError" />
    </section>
  </main>
  <dialog ref="dialog" closedby="any" @close="onClose">
    <form method="dialog">
      <AddressDialog v-if="isAddress(changed)" :address="changed" />
      <BlockDialog v-else-if="isBlockNumber(changed)" :block-number="changed" />
      <TransactionDialog v-else-if="isHash(changed)" :hash="changed" />
      <div v-else class="error">{{ changed }} は認識できません</div>
    </form>
  </dialog>
</template>

<script lang="ts" setup>
import { isAddress, isHash } from "viem";
import { ref, watch } from "vue";

import { getChainMetadata, isBlockNumber } from "../../utils/viem.ts";
import AddressDialog from "./components/address/Dialog.vue";
import BlockDialog from "./components/block/Dialog.vue";
import BlockList from "./components/block/List.vue";
import TransactionDialog from "./components/transaction/Dialog.vue";
import TransactionList from "./components/transaction/List.vue";

const dialog = ref<HTMLDialogElement>();
const changed = ref("");
const error = ref("");

const meta = getChainMetadata();

watch(changed, (value) => {
  if (value) {
    dialog.value?.showModal();
  }
});

function onChange(value: string) {
  changed.value = value;
}

function onClose() {
  changed.value = "";
}

function onSubmit(event: SubmitEvent) {
  const formData = new FormData(event.target as HTMLFormElement);
  onChange(formData.get("search") as string);
}

function onError(message: string) {
  error.value = message;
}
</script>
