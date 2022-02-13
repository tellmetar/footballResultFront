<template>
<div>


  <a-transfer
    :dataSource="userData"
    show-search
    :list-style="{
      width: '250px',
      height: '300px',
    }"
    :operations="['to Team 1', 'delete']"
    :target-keys="targetKeys1"
    :render="item => `${item.name}-${item.number}`"
    :titles="['', '队伍1']"
    :locale="{itemsUnit:'人'}"
    @change="handleChange"
  >
    <a-button
      slot="footer"
      size="small"
      style="float:right;margin: 5px"
      @click="getUserList"
    >
      reload
    </a-button>
    <span slot="notFoundContent">
      没数据
    </span>
  </a-transfer>

<br/>

  <a-transfer
    :dataSource="userData"
    show-search
    :list-style="{
      width: '250px',
      height: '300px',
    }"
    :operations="['to Team 2', 'delete']"
    :target-keys="targetKeys2"
    :render="item => `${item.name}-${item.number}`"
    :titles="['', '队伍2']"
    :locale="{itemsUnit:'人'}"
    @change="handleChange2"
  >
    <a-button
      slot="footer"
      size="small"
      style="float:right;margin: 5px"
      @click="getUserList"
    >
      reload
    </a-button>
    <span slot="notFoundContent">
      没数据
    </span>
  </a-transfer>

<br/>

    <a-form-model
        :model="form"
        :label-col="{ span: 9 }"
        :wrapper-col="{ span: 1 }"
      >
        <a-form-model-item label="轮数">
          <a-input-number v-model="form.round" />
        </a-form-model-item>
        <a-form-model-item label="比赛日">
            <a-date-picker @change="onChangeDate"/>
        </a-form-model-item>
        <a-form-model-item label="队长1">
            <a-select
                show-search
                :value="form.captain1_uid"
                placeholder="input search text"
                style="width: 200px"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSearch1"
                @change="handleChangeCaptain1"
            >
            <a-select-option v-for="d in userData" :key="d.id">
            {{ d.name }}
            </a-select-option>
            </a-select>
        </a-form-model-item>
        <a-form-model-item label="队长2">
            <a-select
                show-search
                :value="form.captain2_uid"
                placeholder="input search text"
                style="width: 200px"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSearch2"
                @change="handleChangeCaptain2"
            >
            <a-select-option v-for="d in userData" :key="d.id">
            {{ d.name }}
            </a-select-option>
            </a-select>
        </a-form-model-item>

        <a-form-model-item  v-model="form.result" label="胜负结果">
            <a-select style="width: 120px" @change="handleChangeResult">
            <a-select-option value="1">
                队伍1赢
            </a-select-option>
            <a-select-option value="3">
                平
            </a-select-option>
            <a-select-option value="2">
                队伍2赢
            </a-select-option>
            </a-select>
        </a-form-model-item>

        <a-form-model-item  label="胜负结果">
            <a-
        </a-form-model-item>
        
        <button @click="confirm"> 确认 </button>


      </a-form-model>


  </div>
</template>
<script>
import { getUser, createResultApi } from "../services/user";

export default {
  data() {
    return {
        form:{
            captain1_uid:undefined,
            captain2_uid:undefined,
            result: 1
        },
        userData: [],
        targetKeys1: [],
        targetKeys2: [],
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
      confirm(){
          createResultApi({
              ...this.form,
              team1: this.targetKeys1,
              team2: this.targetKeys2,
          }).then(r => {
              console.log("r", r)
          })
      },
    onChangeDate(value, s){
        console.log(value)
        this.form.date = s
    },
    handleChangeCaptain1(value){
                      console.log("value", value)
        this.form.captain1_uid = value
    },
    handleChangeCaptain2(value){
        this.form.captain2_uid = value
    },
    handleSearch1(){

    },
    handleSearch2(){

    },
    handleChangeResult(v){
        this.result = v
    },
    getUserList() {
      getUser({
        size:150,
      }).then((r) => {
        console.log(r);
        this.userData = r.data.data.userList;
        for (let user of this.userData){
            user.key = "" + user.id
            user.chosen = false
        }
      });
    },
    handleChange(targetKeys, direction, moveKeys) {
      console.log("team1",targetKeys, direction, moveKeys);
      this.targetKeys1 = targetKeys;
    },
    handleChange2(targetKeys, direction, moveKeys) {
      console.log("team2",targetKeys, direction, moveKeys);
      this.targetKeys2 = targetKeys;
    },
  },
};
</script>