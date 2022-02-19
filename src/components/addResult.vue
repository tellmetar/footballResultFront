<template>
  <div>
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
    <h3 :style="{ margin: '16px 0' }">{{ isEdit ? "编辑" : "新建" }}战况</h3>

    <a-transfer
      :dataSource="userData"
      show-search
      :list-style="{
        width: '250px',
        height: '300px',
      }"
      :operations="['to Team 1', 'delete']"
      :target-keys="targetKeys1"
      :render="(item) => `${item.name}-${item.number}`"
      :titles="['', '队伍1']"
      :locale="{ itemsUnit: '人' }"
      @change="handleChange"
    >
      <a-button
        slot="footer"
        size="small"
        style="float: right; margin: 5px"
        @click="getUserList"
      >
        reload
      </a-button>
      <span slot="notFoundContent"> 没数据 </span>
    </a-transfer>

    <br />

    <a-transfer
      :dataSource="userData"
      show-search
      :list-style="{
        width: '250px',
        height: '300px',
      }"
      :operations="['to Team 2', 'delete']"
      :target-keys="targetKeys2"
      :render="(item) => `${item.name}-${item.number}`"
      :titles="['', '队伍2']"
      :locale="{ itemsUnit: '人' }"
      @change="handleChange2"
    >
      <a-button
        slot="footer"
        size="small"
        style="float: right; margin: 5px"
        @click="getUserList"
      >
        reload
      </a-button>
      <span slot="notFoundContent"> 没数据 </span>
    </a-transfer>

    <br />

    <a-form-model :model="form">
      <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="4">
          <a-form-model-item label="轮数">
            <a-input-number :disabled="isEdit" v-model="form.round" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-form-model-item label="比赛日">
        <a-date-picker v-model="form.date" @change="onChangeDate" />
      </a-form-model-item>
      <a-form-model-item label="队长1橙">
        <a-select
          show-search
          v-model="form.captain1_uid"
          placeholder="input search text"
          style="width: 200px"
          option-filter-prop="children"
        >
          <a-select-option v-for="d in userData" :key="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="队长2黑">
        <a-select
          show-search
          v-model="form.captain2_uid"
          placeholder="input search text"
          style="width: 200px"
          option-filter-prop="children"
        >
          <a-select-option v-for="d in userData" :key="d.id">
            {{ d.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="胜负结果">
        <a-select
          v-model="form.result"
          style="width: 120px"
          @change="handleChangeResult"
        >
          <a-select-option value="1"> 队伍1赢 </a-select-option>
          <a-select-option value="3"> 平 </a-select-option>
          <a-select-option value="2"> 队伍2赢 </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="比分">
        <a-input-number size="large" v-model="form.score1" />
        :
        <a-input-number size="large" v-model="form.score2" />
      </a-form-model-item>

      <a-form-model-item label="备注">
        <a-textarea
          v-model="form.remark"
          placeholder="记录下你的备注吧"
          :rows="3"
        />
      </a-form-model-item>

      <a-form-model-item>
        <a-button class="editable-add-btn" @click="handleAdd"> 新增进球者⚽ </a-button>
        <a-table bordered :data-source="scoreList" :columns="columns">
          <template slot="name" slot-scope="text, record">
            <a-select
              show-search
              v-model="record.uid"
              placeholder="input search text"
              style="width: 200px"
              option-filter-prop="children"
            >
              <a-select-option v-for="d in userData" :key="d.id">
                {{ d.name }}
              </a-select-option>
            </a-select>

          </template>
          <template slot="score" slot-scope="text, record">
              <a-input-number size="large" v-model="record.score" />
          </template>
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm
              v-if="scoreList.length"
              title="Sure to delete?"
              @confirm="() => onDelete(record.key)"
            >
              <a href="javascript:;">Delete</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-form-model-item>

      <a-form-model-item>
        <a-button class="editable-add-btn" @click="handleAddAssist"> 新增助攻者👍 </a-button>
        <a-table bordered :data-source="assistList" :columns="assistColumns">
          <template slot="name" slot-scope="text, record">
            <a-select
              show-search
              v-model="record.uid"
              placeholder="input search text"
              style="width: 200px"
              option-filter-prop="children"
            >
              <a-select-option v-for="d in userData" :key="d.id">
                {{ d.name }}
              </a-select-option>
            </a-select>

          </template>
          <template slot="assist" slot-scope="text, record">
              <a-input-number size="large" v-model="record.assist" />
          </template>
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm
              v-if="assistList.length"
              title="Sure to delete?"
              @confirm="() => onDeleteAssist(record.key)"
            >
              <a href="javascript:;">Delete</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-form-model-item>

      <a-form-model-item>
        <a-space>
          <a-button type="primary" size="large" @click="confirm" block
            >确认</a-button
          >
          <a-button size="large"
            ><router-link to="/result">取消</router-link></a-button
          >
        </a-space>
      </a-form-model-item>
    </a-form-model>
    <br />
    <br />
    <br />
      <div>
    <a-back-top />
  </div>
  </div>

</template>
<script>
import {
  getUser,
  createResultApi,
  getResultDetailApi,
  putResultApi,
  getWinningRateApi
} from "../services/user";

export default {
  data() {
    return {
      scoreList:[],
      count: 1,
      assistList: [],
      assistCount: 1,
      columns: [
        {
          title: "队员",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "进球数⚽",
          dataIndex: "score",
          scopedSlots: { customRender: "score" },
        },
        {
          title: "operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      assistColumns: [
        {
          title: "队员",
          dataIndex: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "助攻数👍",
          dataIndex: "assist",
          scopedSlots: { customRender: "assist" },
        },
        {
          title: "operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      isEdit: false,
      form: {
        captain1_uid: undefined,
        captain2_uid: undefined,
        result: undefined,
      },
      userData: [],
      targetKeys1: [],
      targetKeys2: [],
    };
  },
  created() {
    if (this.$route.query.id != undefined) {
      this.isEdit = true;
      this.getResultDetail();
    }
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    handleAddAssist() {
      const { assistCount, assistList } = this;
      const newData = {
        key: assistCount,
        uid: undefined,
        assist: undefined,
      };
      this.assistList = [...assistList, newData];
      this.assistCount = assistCount + 1;
    },
    handleAdd() {
      const { count, scoreList } = this;
      const newData = {
        key: count,
        uid: undefined,
        score: undefined,
      };
      this.scoreList = [...scoreList, newData];
      this.count = count + 1;
    },
    onDeleteAssist(key) {
      const assistList = [...this.assistList];
      this.assistList = assistList.filter(item => item.key !== key);
    },
    onDelete(key) {
      const scoreList = [...this.scoreList];
      this.scoreList = scoreList.filter(item => item.key !== key);
    },
    getResultDetail() {
      getResultDetailApi(this.$route.query.id).then((r) => {
        if (r.data && r.data.result) {
          this.form = r.data.result;
          if (this.form.result) {
            //fixme: 这里有更好的解决方案吗?
            this.form.result = this.form.result + "";
          }
        }
        if (r.data && r.data.team) {
          for (const e of r.data.team) {
            if (e.team == 1 && this.targetKeys1.indexOf(e.uid + "") == -1) {
              this.targetKeys1.push(e.uid + "");
            }
            if (e.team == 2 && this.targetKeys2.indexOf(e.uid + "") == -1) {
              this.targetKeys2.push(e.uid + "");
            }
          }
        }
        if (r.data && r.data.scoreList){
          this.scoreList = r.data.scoreList
        }
        if (r.data && r.data.assistList){
          this.assistList = r.data.assistList
        }
        console.log(this.targetKeys1, "===========");
      });
    },
    getWinningRates() {
      getWinningRateApi()
    },
    confirm() {
      console.log("scoreList", this.scoreList)
      this.form.scoreList = this.scoreList
      this.form.assistList = this.assistList
      if (this.isEdit) {
        putResultApi({
          ...this.form,
          team1: this.targetKeys1,
          team2: this.targetKeys2,
        })
          .then((r) => {
            if (r.status == 200 && r.data.code == 200) {
              this.$message.success("修改成功");
              this.getWinningRates()
              console.log("r", r);
              // this.$router.push("/result");
            } else {
              this.$message.error(r.data.data);
            }
          })
          .catch((e) => {
            console.log("e", e);
            this.$message.error("系统错误,请不要联系ivan");
          });
      } else {
        if (!this.form.round) {
          this.$message.error("把第几轮填下,唯一必填字段,檀檀");
        } else {
          createResultApi({
            ...this.form,
            team1: this.targetKeys1,
            team2: this.targetKeys2,
          })
            .then((r) => {
              if (r.status == 200 && r.data.code == 200) {
                this.$message.success("添加成功");
                this.getWinningRates()
                console.log("r", r);
                this.$router.push("/result");
              } else {
                this.$message.error(r.data.data);
              }
            })
            .catch((e) => {
              console.log("e", e);
              this.$message.error("系统错误,请不要联系ivan");
            });
        }
      }
    },
    onChangeDate(value, s) {
      console.log(value);
      this.form.date = s;
    },
    handleChangeResult(v) {
      this.result = v;
    },
    getUserList() {
      getUser({
        size: 150,
      }).then((r) => {
        console.log(r);
        this.userData = r.data.data.userList;
        for (let user of this.userData) {
          user.key = "" + user.id;
          user.chosen = false;
        }
      });
    },
    handleChange(targetKeys, direction, moveKeys) {
      console.log("team1", targetKeys, direction, moveKeys);
      this.targetKeys1 = targetKeys;
    },
    handleChange2(targetKeys, direction, moveKeys) {
      console.log("team2", targetKeys, direction, moveKeys);
      this.targetKeys2 = targetKeys;
    },
  },
};
</script>
<style>
.editable-add-btn {
  margin-bottom: 8px;
}
</style>