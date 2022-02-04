<template>
  <div class="hello">
    <a-table
      :columns="columns"
      :data-source="userList"
      :pagination = "paginationOpt"
    >
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="customTitle"><a-icon type="smile-o" /> Name</span>

      <span slot="action" slot-scope="text, record">
        <a>Invite 一 {{ record.name }}</a>
        <a-divider type="vertical" />
        <a>Delete</a>
        <a-divider type="vertical" />
        <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
      </span>
    </a-table> 
  </div>
</template>

<script>
import { getUser } from "../services/user";

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
    this.getUserList({page:1, size:10});
  },
  methods: {
    getUserList() {
      this.loading = true;
      getUser({page: this.paginationOpt.defaultCurrent, size: this.paginationOpt.defaultPageSize}).then((r) => {
        console.log(r);
        const paginationOpt = { ...this.paginationOpt };
        paginationOpt.total = r.data.data.total
        this.loading = false;
        this.paginationOpt = paginationOpt;
        console.log("this.pag", this.paginationOpt)
        this.userList = r.data.data.userList;
      });
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
