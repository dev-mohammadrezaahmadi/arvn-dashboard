<script setup lang="ts">
import { PAGE_SIZE_LIMIT } from "~/constants/global";
import { getAllArticles } from "~/services/articles";
import { ref } from "vue";
import type { Article } from "~/types";

const currentPage = ref(1);
const { error, status, data, refresh } = await useAsyncData(
  "articles",
  () =>
    getAllArticles({
      limit: PAGE_SIZE_LIMIT,
      offset: (currentPage.value - 1) * PAGE_SIZE_LIMIT,
    }),
  {
    transform: (ctx: { articles: Article[]; articlesCount: number }) => ({
      articlesCount: ctx.articlesCount,
      articles: ctx.articles.map((article, idx) => ({
        ...article,
        id: idx + (currentPage.value - 1) * PAGE_SIZE_LIMIT + 1,
        author: article.author.username,
      })),
    }),
  }
);

const columns = [
  {
    key: "id",
    label: "#",
  },
  {
    key: "title",
    label: "Title",
  },
  {
    key: "author",
    label: "Author",
  },
  {
    key: "tagList",
    label: "Tags",
  },
  {
    key: "description",
    label: "Excerpt",
  },
  {
    key: "createdAt",
    label: "Created",
  },
  {
    key: "actions"
  }
];

const items = (row: any) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }, {
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => console.log('Delete', row.id)
  }]
]

watch(currentPage, () => {
  refresh();
});
</script>


<template>
  <UTable :loading="status === 'pending'" :rows="data?.articles" :columns="columns">
    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
      </UDropdown>
    </template>
  </UTable>
  <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
    <UPagination v-model="currentPage" :page-count="PAGE_SIZE_LIMIT" :total="data?.articlesCount || 0" />
  </div>
</template>

<style scoped></style>
