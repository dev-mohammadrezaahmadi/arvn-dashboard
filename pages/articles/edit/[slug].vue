<template>
  <div class="flex p-10">
    <UForm class="w-1/2" :state="state" @submit="onFormSubmit">
      <UFormGroup label="Title" name="title">
        <UInput v-model="state.title" />
      </UFormGroup>

      <UFormGroup label="Description" name="description">
        <UInput v-model="state.description" />
      </UFormGroup>

      <UFormGroup label="Body" name="body">
        <UTextarea v-model="state.body" />
      </UFormGroup>

      <UButton type="submit">Submit</UButton>
    </UForm>

    <UForm :state="state" @submit="onTagFormSubmit">
      <!-- tag list -->
      <UFormGroup label="Tags" name="newTag">
        <UInput v-model="tagsFormState.newTag" placeholder="New tag" />
      </UFormGroup>

      <div class="flex flex-col gap-2">
        <UCheckbox
          v-for="tag in state.tagList"
          v-model="tag.isActive"
          :label="tag.name"
        />
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

const { status, error, execute } = useAsyncData(
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
  router.push("/");
  toast.add({ title: "article has been updated successfuly" });
}
</script>

<style scoped></style>
