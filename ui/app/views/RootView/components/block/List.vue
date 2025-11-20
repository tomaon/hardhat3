<template>
  <table id="block-list">
    <thead>
      <tr>
        <th>Block / Time</th>
        <th>Miner</th>
        <th>Txns / Contracts</th>
      </tr>
    </thead>
    <tbody ref="tbody" />
  </table>
</template>

<script lang="ts" setup>
import { h, onBeforeUnmount, ref, render } from "vue";

import type {
  BlocksData,
  Input,
  Output,
} from "../../../../workers/viem/index.ts";
import Item from "./Item.vue";

const emit = defineEmits<{
  change: [string];
  error: [string];
}>();

const tbody = ref<HTMLTableSectionElement>();

const intersectionObserver = new IntersectionObserver((entries, observer) => {
  for (const e of entries) {
    if (!e.isIntersecting && tbody.value) {
      observer.unobserve(tbody.value.removeChild(e.target));
    }
  }
});

const watcher = createWatcher();

onBeforeUnmount(() => {
  watcher.postMessage({ cmd: "stop" } as Input);
  intersectionObserver.disconnect();
});

function onChange(value: string) {
  emit("change", value);
}

function createWatcher() {
  const worker = new Worker(
    new URL("../../../../workers/viem/block.ts", import.meta.url),
    { type: "module" },
  );

  worker.addEventListener("error", (event: Event) => {
    console.warn("block(m).error", event);
  });

  worker.addEventListener("messageerror", (event: MessageEvent) => {
    console.warn("block(m).messageerror", event);
  });

  worker.addEventListener(
    "message",
    ({ data }: MessageEvent<Output<BlocksData>>) => {
      if (data.kind === "t") {
        for (const e of data.result) {
          if (!tbody.value) continue;
          const tr = document.createElement("tr");
          render(h(Item, { ...e, onChange }), tr);
          tbody.value.insertBefore(tr, tbody.value.firstChild);
          intersectionObserver.observe(tr);
        }
      } else {
        emit("error", data.message);
      }
    },
  );

  worker.postMessage({ cmd: "start" } as Input);

  return worker;
}
</script>
