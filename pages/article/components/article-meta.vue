<template>
    <div class="article-meta">
        <nuxt-link :to="{
            name:'profile',
            params:{
                username:article.author.username
            }
        }">
            <img :src="article.author.image"/>
        </nuxt-link>
        <div class="info">
            <nuxt-link class="author"
                       :to="{
                name:'profile',
                params:{
                username:article.author.username
            }
        }">
                {{article.author.username}}
            </nuxt-link>
            <span class="date">{{article.createdAt | date('MMM DD,YYYY')}}</span>
        </div>
        <!--如果登录，并且文章是自己发布的，即可操作编辑删除-->
        <template v-if="user && user.username === article.author.username">
            <nuxt-link class="btn btn-outline-secondary btn-sm"
                       :to="{
                          name: 'editor',
                          params: {
                            slug: article.slug,
                          },
                        }">
                <i class="ion-edit"></i> Edit Article
            </nuxt-link>
            <button class="btn btn-outline-danger btn-sm"
                    :disabled="isDeleting"
                    :class="{disabled: isDeleting}"
                    @click="deleteArticle()">
                <i class="ion-trash-a"></i> Delete Article
            </button>

        </template>
        <!--如果未登录，或者文章不是直接发布的，则显示文章关注及点赞-->
        <template v-else>
            <button class="btn btn-sm btn-outline-secondary"
                    :class="{
                        active:article.author.following
                    }"
                    :disabled="followDisabled"
                    @click="onFollow()"
            >
                <i class="ion-plus-round"></i>
                {{article.author.following?`Unfollow `:`Follow `}} {{article.author.username}}
            </button>
            <button class="btn btn-sm btn-outline-primary"
                    :class="{
                        active:article.favorited
                    }"
                    @click="onFavorite()"
                    :disabled="favoriteDisabled"
            >
                <i class="ion-heart"></i>
                Favorite Post <span class="counter">({{article.favoritesCount}})</span>
            </button>
        </template>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {addFavorite, deleteArticle, deleteFavorite, addFollow, unFollow} from "../../../api/articles";

    export default {
        name: "ArticleMeta",
        props: {
            article: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                isDeleting: false,
                favoriteDisabled: false,
                followDisabled: false,
            }
        },
        computed: {
            ...mapState(["user"]),
        },
        methods: {
            //删除文章，跳转首页
            async deleteArticle() {
                this.isDeleting = true
                await deleteArticle(this.article.slug)
                this.isDeleting = false
                this.$router.push('/')
            },
            async onFavorite() {
                //如果未登录跳转登录页
                if (!this.user) {
                    this.$router.push('/login')
                    return
                }
                this.favoriteDisabled = true
                if (this.article.favorited) {
                    // 取消点赞
                    await deleteFavorite(this.article.slug)
                    this.article.favorited = false;
                    this.article.favoritesCount += -1
                } else {
                    //添加点赞
                    await addFavorite(this.article.slug)
                    this.article.favorited = true;
                    this.article.favoritesCount += 1
                }
                this.favoriteDisabled = false
            },
            async onFollow() {
                //如果未登录跳转登录页
                if (!this.user) {
                    this.$router.push('/login')
                    return
                }
                this.followDisabled = true
                if (this.article.author.following) {
                    // 取消关注
                    await unFollow(this.article.author.username)
                    this.article.author.following = false;
                } else {
                    //关注作者
                    await addFollow(this.article.author.username)
                    this.article.author.following = true;
                }
                this.followDisabled = false
            },
        }
    }
</script>

<style scoped>

</style>