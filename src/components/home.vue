<template>



  <div class="home">
    <div id="components-form-demo-advanced-search">
      <a-form-model layout="inline" class="ant-advanced-search-form" :model="q">
        <a-row>
          <a-col>
            <a-form-item>
              <a-input v-model="q.name" placeholder="输入名字搜索"/>
            </a-form-item>
            <a-form-item  >
              <a-input v-model="q.number" placeholder="输入号码搜索"/>
            </a-form-item>
            <a-button type="primary"  @click="getUserList">
              Search
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
              Clear
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <div>    
      <a-row type="flex" justify="end">
        <a-col>
          <a-space>
            <a-button type="primary" @click="showModal"> 新增队员 </a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-row>
        <a-table
          :columns="columns"
          :data-source="userList"
          :pagination = "paginationOpt"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <span slot="customTitle"><a-icon type="smile-o" /> Name</span>

          <span slot="action" slot-scope="text, record">
            <!-- <a-divider type="vertical" /> -->
            <button @click="del(text,record)">Delete</button>
            <!-- <a-divider type="vertical" /> -->
            <!-- <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a> -->
          </span>
        </a-table> 
      </a-row>
    </div>

    <a-modal
      title="新增队员"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        :model="form"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-model-item label="Name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="Number">
          <a-input-number :min=0 :max=999 v-model="form.number" />
        </a-form-model-item>
        <a-form-model-item label="其他你还想填什么">
          <a-input :disabled="true" v-model="form.pw" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getUser, createUserApi } from "../services/user";

const columns = [
  {
    dataIndex: "name",
    key: "name",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
  },
  {
    title: "Number",
    dataIndex: "number",
    key: "number",
  },

  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      userList: [],
      columns,
      visible:false,
      confirmLoading: false,
      form:{},
      q:{},
      paginationOpt: {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 5, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total) => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => {
          this.paginationOpt.defaultCurrent = 1;
          this.paginationOpt.defaultPageSize = pageSize;
          this.getUserList(); //显示列表的接口名称
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOpt.defaultCurrent = current;
          this.paginationOpt.defaultPageSize = size;
          this.getUserList();
        },
      },
      loading: false,
    };
  },
  created() {
    this.getUserList({ page: 1, size: 10 });
  },
  methods: {
    del(){

    },
    handleReset(){
      this.q ={}
    },
    getUserList() {
      this.loading = true;
      getUser({
        ...this.form,
        page: this.paginationOpt.defaultCurrent,
        size: this.paginationOpt.defaultPageSize,
      }).then((r) => {
        console.log(r);
        const paginationOpt = { ...this.paginationOpt };
        paginationOpt.total = r.data.data.total;
        this.loading = false;
        this.paginationOpt = paginationOpt;
        console.log("this.pag", this.paginationOpt);
        this.userList = r.data.data.userList;
      });
    },
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.confirmLoading = true;
      createUserApi(this.form).then((resp) => {
        if (resp.status == 200 && resp.data.code == 200) {
          this.$message.success("新建队员成功");
          this.form = {}
          this.getUserList();
          setTimeout(() => {
            this.visible = false;
            this.confirmLoading = false;
          }, 10);
        } else {
          this.confirmLoading = false;
          this.$message.error(resp.data.data);
        }
      }).catch(e => {
        this.confirmLoading = false
        console.log("ee", e)
        this.$message.error("system error, plz try again or contact lyf");
      });
    },
    handleCancel() {
      console.log("Clicked cancel button");
      this.visible = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
