<template>
    <div class="json-edit-wrapper">
        <div id="jsonEditor" ref="jsonEditor" class="item item-left"></div>
        <pre class="item item-right">{{json}}</pre>
    </div>
</template>

<script>

import JSONEditor from 'jsoneditor/dist/jsoneditor.js'
import 'jsoneditor/dist/jsoneditor.css'
import axios from "axios";


export default {
    name: "JsonEditor",
    data: function () {
        return {
            jsonEditor: null,
            json: {},
            isBeautifulOutput: true
        }
    },
    props: {
        str: String
    },
    methods: {
        onChange() {
            const value = this.jsonEditor.get();
            this.json = value;
        },
        // eslint-disable-next-line no-unused-vars
        onChangeJSON(json) {
            //
        },
        async getJson() {
            const input = this.str || '';
            if (input.startsWith('http://') || input.startsWith('https://')) {
                this.json = await axios.get(input);
            } else if (typeof input === 'object' && input !== null) {
                this.json = input;
            } else if (typeof input === 'string') {
                this.json = JSON.parse(input);
            }
        },
        initJsonEditor() {
            this.jsonEditor = new JSONEditor(document.getElementById('jsonEditor'), {
                mode: 'tree',
                onChange: this.onChange,
                onChangeJSON: this.onChangeJSON,
                navigationBar: false,
                statusBar: false,
                history: false,
                onCreateMenu: function (menuItems) {
                    // 过滤掉不想显示的操作
                    return menuItems.filter(function(item) {
                        // 隐藏 '排序', '变换', '提取' 等功能
                        return item.text !== '排序' && item.text !== '变换' && item.text !== '提取';
                    });
                },
                // eslint-disable-next-line no-unused-vars
                onEvent: function (node, event) {

                }
            });
            this.jsonEditor.set(this.json);
        },
        // 设置主题色
        setStyle() {
            //
        }
    },
    async mounted() {
        await this.getJson();
        this.initJsonEditor();
        this.setStyle();
    }
}
</script>

<style scoped>
     .json-edit-wrapper {
         display: flex;
         flex-direction: row;
         justify-content: space-around;
         align-items: center;
         width: 100%;
         height: 100vh;
         .item {
             flex: 1;
             height: 100%;
         }
         .item-left {
             padding: 16px 8px 16px 16px;
         }
         .item-right {
             padding:  16px 16px 16px 8px;
         }
         pre {
             overflow-wrap: break-word;
             white-space: pre-wrap;
             overflow-y: scroll;
         }
     }
</style>
