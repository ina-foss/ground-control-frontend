<template>
  <!-- sonar-ignore -->
  <div v-html="parsedMarkdown" class="markdown-content"></div>
</template>

<script>
import md from "@/utils/markdown";
import DOMPurify from "dompurify";

export default {
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  computed: {
    parsedMarkdown() {
      const html = md.render(this.content);
      return DOMPurify.sanitize(html);
    },
  },
};
</script>

<style>
.markdown-content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}
.markdown-content p {
  line-height: 1.6;
  color: #555;
}
.markdown-content a {
  color: #007bff;
  text-decoration: none;
}
.markdown-content a:hover {
  text-decoration: underline;
}
</style>
