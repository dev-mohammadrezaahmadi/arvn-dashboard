<script setup lang="ts">
import { PAGE_SIZE_LIMIT } from "~/constants/global";
import { getAllArticles, deleteArticle } from "~/services/articles";
import { useUserStore } from '~/stores/user';
import { ref } from "vue";
import type { Article } from "~/types";

definePageMeta({
  middleware: ["02-need-auth"],
});


const userStore = useUserStore()

const router = useRouter();

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
      click: () => {
        setSelectedArticleId(row.slug);
        goToUpdateArticlePage(row.slug);
      },
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

const { status: deleteAritcleStatus, execute } = await useAsyncData(
  () => deleteArticle(selectedArticleId.value as string),
  { server: false }
);

const selectedArticleId = ref<string | undefined>();
function setSelectedArticleId(id: string) {
  selectedArticleId.value = id;
}
const toast = useToast();
async function handleDeleteArticle() {
  await execute();
  if (deleteAritcleStatus.value === "success") {
    toast.add({ title: "Article deleted successfuly", color: "green", icon: "i-heroicons-check-solid" });
  }
  toggleDeleteArticleModal();
  await refresh();
}

function goToUpdateArticlePage(slug: string) {
  router.push(`/articles/edit/${slug}`);
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
  <div class="w-full">
    <h1 class="px-5 py-5 text-5xl capitalize text-start font-bold">all post</h1>
    <div class="p-5">
      <UTable class="w-full border rounded-md shadow min-h-[580px]" :loading="status === 'pending'" :rows="data?.articles"
        :columns="columns">
        <template #title-data="{ row }">
          <span>{{ row.title.slice(0, 20) + "..." }}</span>
        </template>
        <template #author-data="{ row }">
          <span>{{ row.author.username }}</span>
        </template>
        <template #tagList-data="{ row }">
          <span>{{
            row.tagList.length > 3
            ? row.tagList.slice(0, 3).join(", ") + "..."
            : row.tagList.join(", ")
          }}</span>
        </template>
        <template #description-data="{ row }">
          <span class="line-clamp-1">{{
            row.description.slice(0, 40) + "..."
          }}</span>
        </template>
        <template #createdAt-data="{ row }">
          <span>{{
            Intl.DateTimeFormat("en-US").format(new Date(row.createdAt))
          }}</span>
        </template>
        <template #actions-data="{ row }">
          <UDropdown  :items="items(row)">
            <UButton :disabled="row.author.username !== userStore.currentUser?.username" color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </div>
    <div class="flex w-full justify-center items-center mb-6">
      <UPagination  v-model="currentPage" :page-count="PAGE_SIZE_LIMIT"
        :total="data?.articlesCount || 0" />
    </div>
    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base capitalize font-semibold leading-6 text-gray-900 dark:text-white">
              delete article
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>

        <p>Are you sure to delete article?</p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton class="px-4" @click="toggleDeleteArticleModal" color="gray" variant="solid" label="No" />
            <UButton class="px-4" @click="handleDeleteArticle" color="red" variant="solid" label="Yes"
              :loading="deleteAritcleStatus === 'pending'" />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped></style>
