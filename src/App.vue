<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

html,
body,
#app {
  font-family: 'Noto Sans KR', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

/* reset css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
a,
img,
fieldset {
  text-decoration: none;
  vertical-align: top;
  outline: 1;
  border: none;
}
ul,
ol,
li {
  list-style: none;
}
textarea {
  resize: none;
}
</style>
