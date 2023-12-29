<template>
  <h1 class="px-5 py-5 text-5xl capitalize text-start font-bold">edit article</h1>

  <div class="px-5 py-5 flex flex-col sm:flex-row gap-6">
    <UForm class="flex w-full sm:w-2/3 flex-col gap-6 order-2 sm:order-1" :state="state" @submit="onFormSubmit">
      <UFormGroup label="Title" name="title">
        <UInput size="xl" placeholder="Title" v-model="state.title" />
      </UFormGroup>

      <UFormGroup label="Description" name="description">
        <UInput size="xl" placeholder="Description" v-model="state.description" />
      </UFormGroup>

      <UFormGroup label="Body" name="body">
        <UTextarea resize :rows="10" v-model="state.body" />
      </UFormGroup>

      <UButton :loading="updateArticleStatus === 'pending'" class="w-full sm:w-fit justify-center" size="xl" color="blue" type="submit" label="Submit" />
    </UForm>

    <UForm class="w-full sm:w-1/3 order-1 sm:order-2" :state="state" @submit="onTagFormSubmit">
      <!-- tag list -->
      <UFormGroup label="Tags" name="newTag">
        <UInput size="xl" v-model="tagsFormState.newTag" placeholder="New tag" />
      </UFormGroup>

      <div class="flex flex-col gap-2 mt-6 border border-gray-300 rounded p-4">
        <UCheckbox v-for="tag in sortedTags" v-model="tag.isActive" :label="tag.name" />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { updateArticle, getTags, getArticle } from "~/services/articles";
interface Tag {
  name: string;
  isActive: boolean;
}

const route = useRoute();
const router = useRouter();
const toast = useToast();

const aritcleId = computed(() => route.params.slug as string);

const {
  data: fetchedArticleData,
  pending,
  error: fetchedArticleError,
} = await useAsyncData(() => getArticle(aritcleId.value), {
  server: false,
});

const state = ref<{
  title: string;
  description: string;
  body: string;
  tagList: Tag[];
}>({
  title: "",
  description: "",
  body: "",
  tagList: [],
});

// set initial values
if (fetchedArticleData.value) {
  state.value.title = fetchedArticleData.value.article.title
  state.value.description = fetchedArticleData.value.article.description
  state.value.body = fetchedArticleData.value.article.body
}

const tagsFormState = ref<{
  newTag: string;
}>({
  newTag: "",
});

const activeTags = computed(() =>
  state.value.tagList.filter((tag) => tag.isActive)
);

function onTagFormSubmit() {
  // make sure input is not empty
  if (tagsFormState.value.newTag === "") {
    return;
  }

  state.value.tagList.push({
    name: tagsFormState.value.newTag,
    isActive: true,
  });

  // clear new tag input
  tagsFormState.value.newTag = "";
}

// get initial tags
const { data } = await useAsyncData(() => getTags());
if (data.value) {
  // state.value.tagList = data.value.tags
  state.value.tagList = [
    ...state.value.tagList,
    ...data.value.tags.map((tag) => ({ name: tag, isActive: true })),
  ];
}
const sortedTags = computed(() => {
  return state.value.tagList.sort((a, b) => a.name.localeCompare(b.name));
});

const { status: updateArticleStatus, error, execute } = useAsyncData(
  () =>
    updateArticle({
      slug: aritcleId.value,
      article: {
        ...state.value,
        tagList: activeTags.value.map((tag) => tag.name),
      },
    }),
  { immediate: false, server: false }
);

async function onFormSubmit() {
  await execute();
  if (updateArticleStatus.value === "pending") {
  } else if (updateArticleStatus.value === "error") {
    toast.add({
      title: error.value?.cause as string,
      color: "red",
      icon: "i-heroicons-x-circle-solid",
    });
  } else if (updateArticleStatus.value === "success") {
    toast.add({
      title: "Article updated successfuly",
      color: "green",
      icon: "i-heroicons-check-solid",
    });
    router.push("/");
  }
}
</script>

<style scoped></style>
