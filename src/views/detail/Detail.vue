<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo"/>
    </scroll>
  </div>
</template>

<script>
    import DetailNavBar from "./childComp/DetailNavBar";
    import DetailSwiper from "./childComp/DetailSwiper";
    import DetailBaseInfo from "./childComp/DetailBaseInfo";
    import DetailShopInfo from "./childComp/DetailShopInfo";
    import DetailGoodsInfo from "./childComp/DetailGoodsInfo";
    import DetailParamInfo from "./childComp/DetailParamInfo";

    import Scroll from "components/common/scroll/Scroll";

    import {getDetail , Goods, Shop , GoodsParam} from "network/detail";

    export default {
        name: "Detail",
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramInfo: {}
            }
        },
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            Scroll
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
            })
        },
        methods: {
            imageLoad() {
                this.$refs.scroll.refresh()
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

  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }

</style>
