<!--  -->
<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommand-view :recommands="recommands"/>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGood"/>
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop"/>
  </div>
</template>

<script>
    import HomeSwiper from "./childComps/HomeSwiper";
    import RecommandView from "./childComps/RecommandView"
    import FeatureView from "./childComps/FeatureView"

    import NavBar from "components/common/navbar/NavBar";
    import TabControl from "components/content/tabControl/TabControl"
    import GoodsList from "components/content/goods/GoodsList";
    import Scroll from "components/common/scroll/Scroll";

    import {getHomeMultidata, getHomeGoods} from "network/home";
    import {itemListenerMixin , backTopMixin} from "common/mixin";

    export default {
        name: "Home",
        components: {
            HomeSwiper,
            FeatureView,
            RecommandView,
            NavBar,
            TabControl,
            GoodsList,
            Scroll,
        },
        mixins: [itemListenerMixin , backTopMixin],
        data() {
            return {
                banners: [],
                recommands: [],
                goods: {
                    'pop': {page: 0, list: []},
                    'new': {page: 0, list: []},
                    'sell': {page: 0, list: []}
                },
                currentType: 'pop',
                tabOffsetTop: 0,
                isTabFixed: false,
                saveY: 0,
            };
        },
        computed: {
            showGood() {
                return this.goods[this.currentType].list
            }
        },
        created() {
            //1.请求多个数据
            this.getHomeMultidata()

            //2.请求商品数据
            this.getHomeGoods('pop')
            this.getHomeGoods('new')
            this.getHomeGoods('sell')
        },
        destroyed(){
        },
        activated(){
            this.$refs.scroll.refresh()
            this.$refs.scroll.scrollTo(0,this.saveY,0)
        },
        deactivated(){
            this.saveY = this.$refs.scroll.getScrollY()
            this.$bus.$off('itemImageLoad',this.itemImgListener)
        },
        mounted() {
            this.tabClick(0)
        },
        methods: {
            /*事件监听*/
            tabClick(index) {
                switch (index) {
                    case 0:
                        this.currentType = 'pop'
                        break
                    case 1:
                        this.currentType = 'new'
                        break
                    case 2:
                        this.currentType = 'sell'
                        break
                }
                this.$refs.tabControl1.currentIndex = index
                this.$refs.tabControl2.currentIndex = index
            },
            contentScroll(position) {
                //1.判断backTop是否显示
                this.listenShowBackTop(position)

                //2.决定tabControl是否吸顶
                this.isTabFixed = (-position.y) > this.tabOffsetTop
            },
            loadMore() {
                this.getHomeGoods(this.currentType)
            },
            swiperImageLoad() {
                this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
            },
            /*网络请求*/
            getHomeMultidata() {
                getHomeMultidata().then(res => {
                    this.banners = res.data.banner.list;
                    this.recommands = res.data.recommend.list;
                });
            },
            getHomeGoods(type) {
                const page = this.goods[type].page + 1
                getHomeGoods(type, page).then(res => {
                    this.goods[type].list.push(...res.data.list)
                    this.goods[type].page += 1
                });

                //完成加载更多
                this.$refs.scroll && this.$refs.scroll.finishPullUp()
            }
        }
    };
</script>
<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh; /*视口高度*/
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*浏览器原生*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  /*.tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }*/

  /*.content{
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  }*/

  .content {
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control{
    position: relative;
    z-index: 9;
  }
</style>
