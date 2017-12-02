<template>
<div>
    <Card>
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            jsBundle版本列表
        </p>
        <a href="#" slot="extra" @click.prevent="showAddJsBundle">
            <Icon type="plus"></Icon>
            新增版本
        </a>
        <Table :columns="tableColumns" :data="appJsBundleListData"></Table>
    </Card>
    <Modal v-model="isShowAddJsBundleModal" title="新增版本" @on-ok="onSubmitAddJsBundle">
        <add-page :app-id="appId" v-model="addAppJsBundleData"></add-page>
    </Modal>
</div>
</template>

<script>
import Http from "@/libs/http";
import AddPage from "./add.vue";
export default {
  components: {
    AddPage
  },
  data() {
    return {
      isShowAddJsBundleModal: false,
      tableColumns: [
        {
          title: "标识",
          key: "no"
        },
        {
          title: "最低依赖安卓版本",
          key: "android",
          width: "20%"
        },
        {
          title: "最低依赖苹果版本",
          key: "iOS",
          width: "20%"
        },
        {
          title: "jsVersion",
          key: "jsVersion",
          width: "20%"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.onDeleteJsBundle(params.row.id);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      appJsBundleListData: [],
      addAppJsBundleData: {},
      appId: null
    };
  },
  async created() {
    this.appId =parseInt(this.$route.params.appId);
    await this.loadAppJsBundleListData();
  },
  methods: {
    async loadAppJsBundleListData() {
      this.appJsBundleListData = await Http.get({
        url: "/apps/" + this.appId + "/jsBundles"
      });
    },
    showAddJsBundle() {
      this.addAppJsBundleData = {
        no: "",
        iOS: "",
        android: "",
        jsVersion: "",
        jsPath: "",
        timestamp:''
      };
      this.isShowAddJsBundleModal = true;
    },
    async onSubmitAddJsBundle() {
      const data = await Http.post({
        url: "/apps/" + this.appId + "/jsBundles",
        data: this.addAppJsBundleData
      });
      await this.loadAppJsBundleListData();      
    },
    async onDeleteJsBundle(jsBundleId){
      const data = await Http.delete({
        url: "/apps/jsBundles/"+jsBundleId,
        data: {}
      });
      await this.loadAppJsBundleListData();      
    }
  }
};
</script>

<style scoped>

</style>