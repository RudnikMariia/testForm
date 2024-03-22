<template>
  <v-app>
    <v-main>
      <FormComponent/>
    </v-main>
  </v-app>
</template>

<script>
import FormComponent from './components/FormComponent';

export default {
  name: 'App',

  components: {
    FormComponent,
  },

  data: () => ({
    //
  }),
};
</script>
