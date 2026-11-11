---
id: vuelidate
name: Vuelidate
kind: library
status: work
tags: [validation, forms, vue, schema, composables]
what: "Model-based, decoupled validation library for Vue 3 and Composition API."
why: "Separates validation rules from the template DOM, validating raw reactive data structures with full composability."
problem: "Validating complex forms with interdependent fields directly in DOM templates creates tangled UI logic and fragile error displays."
relations:
  - { to: vue, label: "validates forms in" }
  - { to: composition-api, label: "implemented as composable for" }
  - { to: typescript, label: "typed with" }
links:
  - { title: "Vuelidate Documentation", url: https://vuelidate-next.netlify.app }
alsoIn: []
source: work
---

## Example
```vue
<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, minLength, required } from "@vuelidate/validators";

const formData = reactive({
  email: "",
  password: "",
});

const rules = {
  email: { required, email },
  password: { required, minLength: minLength(8) },
};

const v$ = useVuelidate(rules, formData);

async function onSubmit(): Promise<void> {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  // Process valid form payload
  console.log("Submitting:", formData);
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="field">
      <input v-model="formData.email" type="email" @blur="v$.email.$touch()" />
      <span v-if="v$.email.$error" class="error">
        {{ v$.email.$errors[0]?.$message }}
      </span>
    </div>

    <div class="field">
      <input v-model="formData.password" type="password" @blur="v$.password.$touch()" />
      <span v-if="v$.password.$error" class="error">
        {{ v$.password.$errors[0]?.$message }}
      </span>
    </div>

    <button type="submit" :disabled="v$.$invalid && v$.$dirty">Submit</button>
  </form>
</template>
```

## Key points
- **Model-based architecture**: Validations are declared against reactive data models rather than HTML input elements, keeping business validation decoupled from templates.
- **Lazy evaluation & dirty state**: Errors are evaluated dynamically but typically displayed only after user interaction (`$dirty` / `$touch()`).
- **Async validator support**: Built-in support for asynchronous validators (e.g., checking username availability via an HTTP call) with `$pending` states.
