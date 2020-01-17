<!--  -->
<template>
  <div class="recommand">
    <div v-for="item in recommands" class="recommand-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecommandView',
  props:{
      recommands:{
          type: Array,
          default(){
              return []
          }
      }
  }
}

</script>
<style scoped>
.recommand{
  display: flex;
  width: 100%;
  text-align: center;
  font-size: 12px;
  padding: 10px 0px 20px;
  border-bottom: 8px solid #eee
}

.recommand-item{
  flex: 1;
}

.recommand-item img{
  width: 70px;
  height: 70px;
  margin-bottom: 10px;
}
</style>