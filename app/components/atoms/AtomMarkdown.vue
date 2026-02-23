<template>
  <div v-safe-html="parsedMarkdown" class="prose dark:prose-invert prose-sm prose-h1:text-sm prose-p:text-sm prose-a:text-sm prose-lg w-full m-0"></div>
</template>

<script>
import md from "~/utils/markdown";

export default {
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  computed: {
    parsedMarkdown() {
      return md.render(this.content);
    },
  },
};
</script>
