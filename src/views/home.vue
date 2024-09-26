<template>
    <div>hello world</div>
    <json-editor str= '{
            "Array": [1, 2, 3],
    "Boolean": true,
    "222": null,
    "Number": 123,
    "Object": {"a": "b", "c": "d"},
    "String": "Hello World"
    }'></json-editor></template>

<script>

import JsonEditor from "@/components/JsonEditor.vue";

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "home",
    components: {
        // eslint-disable-next-line vue/no-unused-components
        JsonEditor
    },
    methods: {
    },
    mounted() {}
}

</script>

<style>
</style>
