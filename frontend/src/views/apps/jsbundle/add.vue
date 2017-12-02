<template>
<div>
    <Form :model="value" :label-width="80">
        <FormItem label="标识">
            <Input v-model="value.no" placeholder="jsBundle标识，只是区分显示，跟差分包生成半毛钱关系都没有"></Input>
        </FormItem>
        <FormItem label="jsBundle压缩包上传">
            <Upload :action="'http://127.0.0.1:8000/apps/'+appId+'/jsbundle/upload'" :on-success="uploadSuccess">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传Zip</Button>
            </Upload>
        </FormItem>
        <FormItem label="Android最低依赖版本">
            <Input v-model="value.android" placeholder="Android最低依赖版本"></Input>
        </FormItem>
        <FormItem label="iOS最低依赖版本">
            <Input v-model="value.iOS" placeholder="iOS最低依赖版本"></Input>
        </FormItem>
        <FormItem label="jsVersion">
            <Input v-model="value.jsVersion" placeholder="eros生成的jsVersion"></Input>
        </FormItem>
    </Form>
</div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    android:'',
                    iOS:'',
                    jsVersion:'',
                    no:'',
                    jsPath:''
                };
            }
        },
        appId: {
            type: Number
        }
    },
    methods: {
        uploadSuccess(response, file, fileList) {
            if (response.zipInfo) {
                this.value.android = response.zipInfo.android;
                this.value.iOS = response.zipInfo.iOS;
                this.value.jsVersion = response.zipInfo.jsVersion;
                this.value.jsPath = response.path
                this.value.timestamp = response.zipInfo.timestamp
            }
        }
    }
};
</script>

<style scoped>

</style>