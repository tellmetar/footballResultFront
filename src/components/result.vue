<template>
  <div class="home">
    <a-menu mode="horizontal">
      <a-menu-item key="mail">
        <a-icon type="usergroup-add" />
        <router-link to="/user">球员管理</router-link>
      </a-menu-item>
      <a-menu-item key="app">
        <a-icon type="profile" />
        <router-link to="/result">战况管理 </router-link>
      </a-menu-item>
    </a-menu>
    <h3 :style="{ margin: '16px 0' }">战况</h3>
    <div id="components-form-demo-advanced-search">
      <a-form-model layout="inline" class="ant-advanced-search-form" :model="q">
        <a-row>
          <a-col>
            <a-form-item>
              <a-input v-model="q.round" placeholder="输入轮数搜索" />
            </a-form-item>
            <a-button type="primary" @click="getResult"> Search </a-button>
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
            <a-button type="primary" @click="jumpToAddResult">
              新增战况
            </a-button>
            <!-- <a-button type="primary" @click="getWinningRates">
              更新胜率
            </a-button> -->
          </a-space>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-row>
        <a-table
          :columns="columns"
          :data-source="ResultList"
          :pagination="paginationOpt"
        >
          <span slot="captain1_uid" slot-scope="text">
            {{ displayName(text) }}
          </span>
          <span slot="captain2_uid" slot-scope="text">
            {{ displayName(text) }}
          </span>
          <span slot="result" slot-scope="text">
            {{ displayResult(text) }}
          </span>
          <span slot="score" slot-scope="text, record">
            {{ record.score1 }}: {{record.score2}}
          </span>
          <span slot="action" slot-scope="text, record">
            <!-- <a-divider type="vertical" /> -->
            <button @click="del(text, record)">Delete</button>
            <a-divider type="vertical" />
            <button @click="edit(text, record)">Edit</button>
            <!-- <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a> -->
          </span>
        </a-table>
      </a-row>
    </div>

    <br />
    <br />
    <br />
    <br />
    <br />

    <h3 :style="{ margin: '16px 0' }">个人积分</h3>
    <div>
      <a-form-model
        layout="inline"
        class="ant-advanced-search-form"
        :model="qu"
      >
        <a-row>
          <a-col>
            <a-form-item>
              <a-select
                show-search
                placeholder="Select a person"
                option-filter-prop="children"
                style="width: 200px"
                v-model="qu.uid"
              >
                <a-select-option v-for="d in userList" :key="d.id">
                  {{ d.name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-button type="primary" @click="handleChange"> Search </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="handleReset2">
              Clear
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <div>
      <a-row>
        <a-table
          :columns="winningColumns"
          :data-source="WinningList"
          :pagination="paginationOpt2"
        >
          <span slot="uid" slot-scope="text"> {{ displayName(text) }} </span>
        </a-table>
      </a-row>
    </div>
  </div>
</template>

<script>
import { getResultApi, getUser, getWinningRateApi } from "../services/user";

const winningColumns = [
  {
    title: "队员名字",
    dataIndex: "uid",
    key: "uid",
    scopedSlots: { customRender: "uid" },
  },
  {
    title: "gameAttend",
    dataIndex: "gameAttend",
    key: "gameAttend",
    scopedSlots: { customRender: "gameAttend" },
  },
  {
    title: "winGames",
    dataIndex: "winGames",
    key: "winGames",
  },
  {
    title: "loseGames",
    dataIndex: "loseGames",
    key: "loseGames",
  },
  {
    title: "drawGames",
    dataIndex: "drawGames",
    key: "drawGames",
  },
  {
    title: "胜率",
    dataIndex: "winningRate",
    key: "winningRate",
  },
  {
    title: "不败率",
    dataIndex: "unDefeatedRate",
    key: "unDefeatedRate",
  },
  {
    title: "个人积分",
    dataIndex: "personalPoints",
    key: "personalPoints",
  },
];
const columns = [
  {
    title: "轮数",
    dataIndex: "round",
    key: "round",
    scopedSlots: { customRender: "round" },
  },
  {
    title: "date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "队长1",
    dataIndex: "captain1_uid",
    key: "captain1_uid",
    scopedSlots: { customRender: "captain1_uid" },
  },
  {
    title: "队长2",
    dataIndex: "captain2_uid",
    key: "captain2_uid",
    scopedSlots: { customRender: "captain2_uid" },
  },
  {
    title: "战况",
    dataIndex: "result",
    key: "result",
    scopedSlots: { customRender: "result" },
  },
  {
    title: "比分",
    dataIndex: "score",
    key: "score",
    scopedSlots: { customRender: "score" },
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
    ellipsis: true,
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
      ResultList: [],
      WinningList: [],
      winningColumns,
      columns,
      visible: false,
      confirmLoading: false,
      form: {},
      q: {},
      qu: {},
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
          this.getResult(); //显示列表的接口名称
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOpt.defaultCurrent = current;
          this.paginationOpt.defaultPageSize = size;
          this.getResult();
        },
      },
      paginationOpt2: {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 5, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ["5", "10", "15", "20"],
        showTotal: (total) => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => {
          this.paginationOpt2.defaultCurrent = 1;
          this.paginationOpt2.defaultPageSize = pageSize;
          this.getResult(); //显示列表的接口名称
        },
        // 改变每页数量时更新显示
        onChange: (current, size) => {
          this.paginationOpt2.defaultCurrent = current;
          this.paginationOpt2.defaultPageSize = size;
          this.getResult();
        },
      },
      loading: false,
    };
  },
  computed: {},
  created() {
    this.getResult({ page: 1, size: 10 });
    this.getUserList();
  },
  methods: {

    getWinningRates() {
      getWinningRateApi()
    },
    jumpToAddResult() {
      this.$router.push("/addResult");
    },
    displayName(uid) {
      let name = "";
      this.userList.forEach((e) => {
        if (e.id == uid) {
          name = e.name;
        }
      });
      return name;
    },
    displayResult(r) {
      if (r == 1) {
        return "队伍1赢";
      } else if (r == 2) {
        return "队伍2赢";
      } else if (r == 3) {
        return "平";
      }
    },
    getUserList() {
      getUser({
        page: 1,
        size: 150,
      }).then((r) => {
        this.userList = r.data.data.userList;
      });
    },

    del() {},
    edit(a, r) {
      this.$router.push({ path: "/addResult", query: { id: r.id } });
    },
    handleReset() {
      this.q = {};
      this.paginationOpt.defaultCurrent = 1;
      this.getResult();
    },
    handleReset2() {
      this.qu = {};
      this.paginationOpt2.defaultCurrent = 1;
    },
    getResult() {
      this.loading = true;
      getResultApi({
        ...this.q,
        page: this.paginationOpt.defaultCurrent,
        size: this.paginationOpt.defaultPageSize,
      }).then((r) => {
        this.paginationOpt.total = r.data.data.total;
        this.loading = false;
        this.ResultList = r.data.data.list;
        for (let u of this.ResultList) {
          u.key = u.id;
        }
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
