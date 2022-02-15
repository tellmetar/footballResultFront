<template>
  <div class="home">
        <h3 :style="{ margin: '16px 0' }">
            战绩
        </h3>
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
              新增赛果
            </a-button>
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
          <span slot="action" slot-scope="text, record">
            <!-- <a-divider type="vertical" /> -->
            <button @click="del(text, record)">Delete</button>
            <!-- <a-divider type="vertical" /> -->
            <!-- <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a> -->
          </span>
        </a-table>
      </a-row>
    </div>

<br/>
<br/>
<br/>
<br/>
<br/>


        <h3 :style="{ margin: '16px 0' }">
            个人积分
        </h3>
    <div>
        <a-form-model layout="inline" class="ant-advanced-search-form" :model="q">
            <a-row>
                <a-col>
                    <a-form-item>
                        <a-select
                            show-search
                            placeholder="Select a person"
                            option-filter-prop="children"
                            style="width: 200px"
                            :filter-option="filterOption"
                            v-model="q.uid"
                        >
                            <a-select-option v-for="d in userList" :key="d.id">
                            {{ d.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-button type="primary" @click="handleChange"> Search </a-button>
                    <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
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
    title: "赛果",
    dataIndex: "result",
    key: "result",
  },
  {
    title: "比分",
    dataIndex: "score",
    key: "score",
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
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
      loading: false,
    };
  },
  computed: {},
  created() {
    this.getResult({ page: 1, size: 10 });
    this.getUserList();
    this.getWinningRates();
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`)
      this.getWinningRates()
    },
    getWinningRates() {
      getWinningRateApi(this.q).then((r) => {
        console.log(r);
        this.WinningList.push(r.data.data)
      });
    },
    jumpToAddResult() {
      this.$router.push("/addResult");
    },
    displayName(uid, record) {
      console.log(record);
      let name = "";
      this.userList.forEach((e) => {
        if (e.id == uid) {
          name = e.name;
        }
      });
      return name;
    },
    getUserList() {
      getUser({
        page: 1,
        size: 150,
      }).then((r) => {
        console.log(r);
        this.userList = r.data.data.userList;
      });
    },

    del() {},
    handleReset() {
      this.q = {};
    },
    getResult() {
      this.loading = true;
      getResultApi({
        ...this.q,
        page: this.paginationOpt.defaultCurrent,
        size: this.paginationOpt.defaultPageSize,
      }).then((r) => {
        console.log(r);
        const paginationOpt = { ...this.paginationOpt };
        paginationOpt.total = r.data.data.total;
        this.loading = false;
        this.paginationOpt = paginationOpt;
        console.log("this.pag", this.paginationOpt);
        this.ResultList = r.data.data;
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
