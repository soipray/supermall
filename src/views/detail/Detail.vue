<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommends" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar/>
    <back-top @click.native="backTop" v-show="isShowBackTop"/>
  </div>
</template>

<script>
    import DetailNavBar from "./childComp/DetailNavBar";
    import DetailSwiper from "./childComp/DetailSwiper";
    import DetailBaseInfo from "./childComp/DetailBaseInfo";
    import DetailShopInfo from "./childComp/DetailShopInfo";
    import DetailGoodsInfo from "./childComp/DetailGoodsInfo";
    import DetailParamInfo from "./childComp/DetailParamInfo";
    import DetailCommentInfo from "./childComp/DetailCommentInfo";
    import DetailBottomBar from "./childComp/DetailBottomBar";

    import Scroll from "components/common/scroll/Scroll";
    import GoodsList from "components/content/goods/GoodsList";

    import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
    import {itemListenerMixin , backTopMixin} from "common/mixin";
    import {debounce} from "../../common/utils";

    export default {
        name: "Detail",
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            DetailBottomBar,
            Scroll,
            GoodsList
        },
        mixins: [itemListenerMixin , backTopMixin],
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramInfo: {},
                commentInfo: {},
                recommends: [],
                themeTopYs: [],
                getThemeTopY: null,
                currentIndex: 0,
            }
        },
        created() {
            //保存传入的iid
            this.iid = this.$route.params.iid

            //根据iid请求相应的数据
            getDetail(this.iid).then(res => {
                //获取轮播图数据
                const data = res.result
                this.topImages = data.itemInfo.topImages

                //获取商品信息
                this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

                //创建店铺信息
                this.shop = new Shop(data.shopInfo)

                //保存商品详情数据
                this.detailInfo = data.detailInfo

                //获取参数信息
                this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

                //评论信息
                if (data.rate.cRate !== 0) {
                    this.commentInfo = data.rate.list[0]
                }

                this.$nextTick(() => {

                })
            })

            //请求推荐数据
            getRecommend().then(res => {
                this.recommends = res.data.list
            })

            this.getThemeTopY = debounce(() => {
                this.themeTopYs = []
                this.themeTopYs.push(0)
                this.themeTopYs.push(this.$refs.params.$el.offsetTop)
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
                this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
                this.themeTopYs.push(Number.MAX_VALUE)
            }, 100)
        },
        mounted() {

        },
        updated() {

        },
        destroyed() {
            this.$bus.$off('itemImageLoad', this.itemImgListener)
        },
        methods: {
            imageLoad() {
                this.newRefresh()

                this.getThemeTopY()
            },
            titleClick(index) {
                this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
            },
            contentScroll(position) {
                const y = -position.y
                let length = this.themeTopYs.length

                for (let i = 0; i < length - 1 ; i++) {
                    if (this.currentIndex != i && (y >= this.themeTopYs[i] && y < this.themeTopYs[i + 1])) {
                        this.currentIndex = i
                        this.$refs.nav.currentIndex = this.currentIndex
                    }
                }

                this.listenShowBackTop(position)
            }
        }
    }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }

</style>
