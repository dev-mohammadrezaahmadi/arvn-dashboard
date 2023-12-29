<script setup lang="ts">
import { PAGE_SIZE_LIMIT } from "~/constants/global";
import { getAllArticles, deleteArticle } from "~/services/articles";
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
    key: "actions",
  },
];

const items = (row: any) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit", row.slug),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        setSelectedArticleId(row.slug);
        toggleDeleteArticleModal();
      },
    },
  ],
];

const {status: deleteAritcleStatus, execute} = await useAsyncData(() => deleteArticle(selectedArticleId.value as string), {server: false})

const selectedArticleId = ref<string | undefined>();
function setSelectedArticleId(id: string) {
  selectedArticleId.value = id;
}
const toast = useToast();
async function handleDeleteArticle() {
  await execute()
  if (deleteAritcleStatus.value === 'success') {
    toast.add({ title: "article deleted successfuly", color: "red", icon: "" });
  }
  toggleDeleteArticleModal()
  await refresh()
}

const isOpen = ref(false);

function toggleDeleteArticleModal() {
  isOpen.value = !isOpen.value;
}

watch(currentPage, () => {
  refresh();
});
</script>

<template>
  <UTable
    :loading="status === 'pending'"
    :rows="data?.articles"
    :columns="columns"
  >
    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-ellipsis-horizontal-20-solid"
        />
      </UDropdown>
    </template>
  </UTable>
  <div
    class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
  >
    <UPagination
      v-model="currentPage"
      :page-count="PAGE_SIZE_LIMIT"
      :total="data?.articlesCount || 0"
    />
  </div>
  <UModal v-model="isOpen" prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Modal
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>
      </template>

      <p>Are you sure to delete article?</p>

      <template #footer>
        <div class="flex justify-end gap-4">
          <UButton
            @click="toggleDeleteArticleModal"
            color="gray"
            variant="solid"
            label="No"
          />
          <UButton
            @click="handleDeleteArticle"
            color="red"
            variant="solid"
            label="Yes"
            :loading="deleteAritcleStatus === 'pending'"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
