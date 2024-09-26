<template>
    <div class="json-edit-wrapper">
        <div class="item item-left">
            <div id="jsonEditor" class="child"></div>
        </div>
        <div class="item item-right">
            <div class="toolbar">
                <div v-for="item in menuItems" :key="item.id" class="btn" @click="handleClick(item)">{{ item.label }}</div>
            </div>
            <textarea class="textarea child" disabled readonly></textarea >
        </div>
    </div>
</template>

<script>
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import axios from "axios";

export default {
    name: "JsonEditor",
    data: function () {
        return {
            json: {},
            isBeautifulOutput: true,
            menuItems: [
                {
                    id: 1,
                    label: '格式化JSON',
                },
                {
                    id: 2,
                    label: '压缩JSON',
                },
                {
                    id: 3,
                    label: '复制',
                }
            ]
        }
    },
    props: {
        str: String
    },
    methods: {
        isObject (value) {
            return typeof value === 'object' && value !== null && !Array.isArray(value)
        },
        handleClick(item) {
            const textarea = document.querySelector('.textarea');
            switch (item.id) {
                case 1: {
                    textarea.value = JSON.stringify(this.json, null, 4);
                    break;
                }
                case 2:
                    textarea.value = JSON.stringify(this.json, null, 0);
                    break;
                case 3:
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(JSON.stringify(this.json, null, 0)).then(function() {
                            console.log('复制成功');
                        }).catch(function(err) {
                            console.error('复制失败:', err);
                        });
                    } else {
                        // 创建一个临时文本区域（textarea）用于复制
                        const tempInput = document.createElement('input');
                        tempInput.value = JSON.stringify(this.json, null, 0);
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                        console.log('复制成功');
                    }
                    break;
            }
        },
        onChange() {
            const value = this.jsonEditor.get();
            this.json = value;
            const textarea = document.querySelector('.textarea');
            textarea.value = JSON.stringify(value, null, 4);
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
            const jsonEditor = new JSONEditor(document.getElementById('jsonEditor'), {
                mode: 'tree',
                modes: ['tree', 'code'],
                onChange: this.onChange,
                onChangeJSON: this.onChangeJSON,
                navigationBar: false,
                statusBar: false,
                history: false,
                mainMenuBar: true,
                sortObjectKeys: false,
                enableTransform: false,
                enableSort: false,
                onCreateMenu: function (menuItems) {
                    // 过滤掉不想显示的操作
                    return menuItems.filter(function(item) {
                        // 隐藏 '排序', '变换', '提取' 等功能
                        return item.text !== '排序' && item.text !== '变换' && item.text !== '提取';
                    });
                },
                onModeChange: function () {
                    const jsoneditorPoweredBy = document.querySelector('.jsoneditor-poweredBy');
                    jsoneditorPoweredBy.style.display = 'none';
                }
            });
            jsonEditor.set(this.json);
            // 不能在data中声明jsonEditor, 这样会包裹一层Proxy, 导致JSONEditor部分功能失效
            this.jsonEditor = jsonEditor;

            const textarea = document.querySelector('.textarea');
            textarea.value = JSON.stringify(this.json, null, 4);
            window.gu = jsonEditor;
        },
        // 设置主题色
        setStyle() {}
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
         /deep/ .jsoneditor {
             border: none;
         }
         /deep/ .jsoneditor-menu {
         }
         display: flex;
         flex-direction: row;
         justify-content: space-around;
         align-items: center;
         width: 100%;
         height: 100vh;
         .item {
             flex: 1;
             height: 100%;
             display: flex;
             flex-direction: column;
         }
         .item-left {
             padding: 16px 8px 16px 16px;
         }
         .item-right {
             padding:  16px 16px 16px 8px;
         }
         .child {
             flex: 1;
             border: 1px solid #3883fa;
         }
         .toolbar {
             display: flex;
             flex-direction: row;
             align-items: center;
             height: 34px;
             background: #3883fa;
             color: aliceblue;
             border-bottom: 1px solid #3883fa;
             .btn {
                 margin-right: 16px;
                 margin-left: 16px;
             }
         }
     }
</style>
