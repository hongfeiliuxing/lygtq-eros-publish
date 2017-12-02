<template>
<div>
    <Card>
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            APP列表
        </p>
        <a href="#" slot="extra" @click.prevent="addApp">
            <Icon type="plus"></Icon>
            新增APP
        </a>
        <Table :columns="tableColumns" :data="appListData"></Table>
    </Card>
    <Modal v-model="isShowAddAppModal" title="新增版本" @on-ok="onSubmitAddApp">
        <Form :model="addAppData" :label-width="80">
            <FormItem label="名称">
                <Input v-model="addAppData.name" placeholder="名称"></Input>
            </FormItem>
            <FormItem label="eros标识">
                <Input v-model="addAppData.appName" placeholder="eros生成的appName"></Input>
            </FormItem>
        </Form>
    </Modal>
</div>
</template>

<script>
import Http from '@/libs/http'
export default {
    data() {
        return {
            isShowAddAppModal: false,
            addAppData: {
                name: '',
                appName: ''
            },
            tableColumns: [{
                    title: '名称',
                    key: 'name',
                    width: '30%',
                },
                {
                    title: 'eros标识',
                    key: 'appName'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.onPushManageAppPage(params.row.id)
                                    }
                                }
                            }, '管理'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.onDeleteApp(params.row.id)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            appListData: []
        }
    },
    async created() {
        await this.loadAppDataList()
    },
    methods: {
        async loadAppDataList() {
            this.appListData = await Http.get({
                url: '/apps'
            })
        },
        addApp() {
            this.isShowAddAppModal = true
        },
        async onSubmitAddApp() {
            await Http.post({
                url: '/apps',
                data: this.addAppData
            })
            await this.loadAppDataList()
        },
        onPushManageAppPage(appId) {
            this.$router.push({
                name: 'app_jsbundle',
                params: {
                    appId
                }
            })
        },
        async onDeleteApp(appId) {
            await Http.delete({
                url: '/apps/' + appId,
                data: {}
            })
            await this.loadAppDataList()
        }
    }
};
</script>