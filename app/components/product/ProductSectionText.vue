<script setup lang="ts">
interface Props {
  content?: string
}

defineProps<Props>()
</script>

<template>
  <div
    v-if="content"
    class="prose prose-sm max-w-none dark:prose-invert product-content"
    v-html="content"
  />
</template>

<style scoped>
.product-content {
  color: rgb(55, 65, 81);
  line-height: 1.625;
}

.dark .product-content {
  color: rgb(209, 213, 219);
}

.product-content :deep(h1),
.product-content :deep(h2),
.product-content :deep(h3),
.product-content :deep(h4),
.product-content :deep(h5),
.product-content :deep(h6) {
  font-weight: 700;
  color: rgb(17, 24, 39);
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.dark .product-content :deep(h1),
.dark .product-content :deep(h2),
.dark .product-content :deep(h3),
.dark .product-content :deep(h4),
.dark .product-content :deep(h5),
.dark .product-content :deep(h6) {
  color: rgb(243, 244, 246);
}

.product-content :deep(h1) { font-size: 1.875rem; }
.product-content :deep(h2) { font-size: 1.5rem; }
.product-content :deep(h3) { font-size: 1.25rem; }
.product-content :deep(h4) { font-size: 1.125rem; }

.product-content :deep(p) {
  margin-bottom: 1rem;
}

.product-content :deep(a) {
  color: rgb(37, 99, 235);
  text-decoration: underline;
}

.dark .product-content :deep(a) {
  color: rgb(96, 165, 250);
}

.product-content :deep(a:hover) {
  color: rgb(29, 78, 216);
}

.dark .product-content :deep(a:hover) {
  color: rgb(147, 197, 253);
}

.product-content :deep(ul),
.product-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.product-content :deep(ul) {
  list-style-type: disc;
}

.product-content :deep(ol) {
  list-style-type: decimal;
}

.product-content :deep(li) {
  margin-bottom: 0.25rem;
}

.product-content :deep(blockquote) {
  border-left: 4px solid rgb(209, 213, 219);
  padding-left: 1rem;
  font-style: italic;
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: rgb(75, 85, 99);
}

.dark .product-content :deep(blockquote) {
  border-left-color: rgb(75, 85, 99);
  color: rgb(156, 163, 175);
}

.product-content :deep(code) {
  background-color: rgb(243, 244, 246);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: rgb(220, 38, 38);
}

.dark .product-content :deep(code) {
  background-color: rgb(31, 41, 55);
  color: rgb(248, 113, 113);
}

.product-content :deep(pre) {
  background-color: rgb(243, 244, 246);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.dark .product-content :deep(pre) {
  background-color: rgb(31, 41, 55);
}

.product-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.product-content :deep(img) {
  border-radius: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  max-width: 100%;
  height: auto;
}

.product-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.product-content :deep(th),
.product-content :deep(td) {
  border: 1px solid rgb(209, 213, 219);
  padding: 0.5rem 1rem;
  text-align: left;
}

.dark .product-content :deep(th),
.dark .product-content :deep(td) {
  border-color: rgb(75, 85, 99);
}

.product-content :deep(th) {
  background-color: rgb(243, 244, 246);
  font-weight: 600;
}

.dark .product-content :deep(th) {
  background-color: rgb(31, 41, 55);
}

.product-content :deep(hr) {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border-top: 1px solid rgb(209, 213, 219);
}

.dark .product-content :deep(hr) {
  border-top-color: rgb(75, 85, 99);
}

.product-content :deep(strong) {
  font-weight: 700;
  color: rgb(17, 24, 39);
}

.dark .product-content :deep(strong) {
  color: rgb(243, 244, 246);
}

.product-content :deep(em) {
  font-style: italic;
}

.product-content :deep(.ql-align-center) {
  text-align: center;
}

.product-content :deep(.ql-align-right) {
  text-align: right;
}

.product-content :deep(.ql-align-justify) {
  text-align: justify;
}
</style>
